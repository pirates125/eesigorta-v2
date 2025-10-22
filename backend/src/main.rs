mod auth;
mod config;
mod db;
mod routes;
mod scraper;

use anyhow::Result;
use axum::{
    middleware,
    routing::{get, post, put},
    Router,
};
use sqlx::SqlitePool;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use config::Config;

pub struct AppState {
    pub db: SqlitePool,
    pub config: Config,
}

async fn health_check() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load config
    let config = Config::from_env()?;
    tracing::info!("Config loaded: port={}", config.port);

    // Create database if it doesn't exist
    if !std::path::Path::new("ees.db").exists() {
        std::fs::File::create("ees.db")?;
        tracing::info!("Database file created");
    }

    // Connect to database
    let db = SqlitePool::connect(&config.database_url).await?;
    tracing::info!("Database connected");

    // Run migrations
    sqlx::migrate!("./migrations").run(&db).await?;
    tracing::info!("Migrations completed");

    // Create shared state
    let state = Arc::new(AppState { db, config: config.clone() });

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        // Health check
        .route("/health", get(health_check))
        
        // Public routes
        .route("/api/v1/auth/register", post(routes::register))
        .route("/api/v1/auth/login", post(routes::login))
        
        // Protected user routes
        .nest(
            "/api/v1",
            Router::new()
                .route("/users/profile", get(routes::get_profile))
                .route("/users/profile", put(routes::update_profile))
                .route("/users/password", put(routes::change_password))
                .route("/quotes", post(routes::create_quote))
                .route("/quotes", get(routes::list_quotes))
                .route("/policies", post(routes::create_policy))
                .route("/policies", get(routes::list_policies))
                .route_layer(middleware::from_fn_with_state(
                    state.clone(),
                    auth::require_auth,
                ))
        )
        
        // Admin routes
        .nest(
            "/api/v1/admin",
            Router::new()
                .route("/stats", get(routes::get_stats))
                .route("/users", get(routes::list_users))
                .route_layer(middleware::from_fn_with_state(
                    state.clone(),
                    auth::require_admin,
                ))
        )
        
        .layer(cors)
        .with_state(state);

    // Start server
    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!("Server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
