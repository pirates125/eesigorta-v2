use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use std::sync::Arc;

use crate::{
    auth,
    db::{AuthResponse, CreateUserRequest, LoginRequest, UserProfile},
    AppState,
};

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateUserRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    // Check if user exists
    if let Ok(Some(_)) = crate::db::get_user_by_email(&state.db, &request.email).await {
        return Err(StatusCode::CONFLICT);
    }

    // Create user
    let user = crate::db::create_user(&state.db, request)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Generate token
    let token = auth::generate_token(&user.id, &user.email, &user.role, &state.config.jwt_secret)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(AuthResponse {
        token,
        user: UserProfile::from(user),
    }))
}

pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(request): Json<LoginRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    // Get user
    let user = crate::db::get_user_by_email(&state.db, &request.email)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // Verify password
    let valid = auth::verify_password(&request.password, &user.password_hash)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if !valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Generate token
    let token = auth::generate_token(&user.id, &user.email, &user.role, &state.config.jwt_secret)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(AuthResponse {
        token,
        user: UserProfile::from(user),
    }))
}

