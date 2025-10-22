use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use std::sync::Arc;
use futures::future::join_all;

use crate::{
    auth::Claims,
    db::CreateQuoteRequest,
    scraper::{call_python_scraper, ScraperRequest},
    AppState,
};

pub async fn create_quote(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(request): Json<CreateQuoteRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    tracing::info!("📨 Quote request from user {}: {:?}", claims.sub, request);
    
    // Prepare scraper request base
    let scraper_request_base = ScraperRequest {
        product_type: request.product_type.clone(),
        vehicle_plate: request.vehicle_plate.clone(),
        tckn: request.tckn.clone(),
        extras: None,
    };

    // Call Python scrapers for all providers in parallel
    let mut scraper_tasks = vec![];
    for provider in &request.providers {
        let provider_clone = provider.clone();
        let scraper_request = scraper_request_base.clone();
        
        scraper_tasks.push(async move {
            (provider_clone.clone(), call_python_scraper(&provider_clone, scraper_request).await)
        });
    }

    let scraper_results = join_all(scraper_tasks).await;
    
    // Process results and save quotes
    let mut quotes = vec![];
    for (provider, result) in scraper_results {
        match result {
            Ok(scraper_response) => {
                if scraper_response.success {
                    if let Some(premium) = scraper_response.premium {
                        tracing::info!("✅ Quote from {}: net={}, gross={}", provider, premium.net, premium.gross);
                        
                        // Create individual request for this provider
                        let provider_request = CreateQuoteRequest {
                            providers: vec![provider.clone()],
                            product_type: request.product_type.clone(),
                            vehicle_plate: request.vehicle_plate.clone(),
                            tckn: request.tckn.clone(),
                        };
                        
                        // Save quote to database
                        match crate::db::create_quote(
                            &state.db,
                            &claims.sub,
                            provider_request,
                            premium.net,
                            premium.gross,
                        ).await {
                            Ok(quote) => quotes.push(quote),
                            Err(e) => {
                                tracing::error!("Failed to save quote for {}: {}", provider, e);
                            }
                        }
                    } else {
                        tracing::warn!("⚠️ Quote from {} has no premium info", provider);
                    }
                } else {
                    tracing::warn!("⚠️ Quote from {} failed: {:?}", provider, scraper_response.error);
                }
            }
            Err(e) => {
                tracing::error!("❌ Scraper error for {}: {}", provider, e);
            }
        }
    }

    if quotes.is_empty() {
        tracing::error!("❌ No successful quotes from any provider");
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    tracing::info!("✅ Successfully created {} quotes", quotes.len());
    Ok(Json(quotes))
}

pub async fn list_quotes(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
) -> Result<impl IntoResponse, StatusCode> {
    let quotes = crate::db::list_user_quotes(&state.db, &claims.sub)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(quotes))
}

