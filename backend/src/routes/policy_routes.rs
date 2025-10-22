use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::Deserialize;
use std::sync::Arc;

use crate::{auth::Claims, AppState};

#[derive(Debug, Deserialize)]
pub struct CreatePolicyRequest {
    pub quote_id: String,
}

pub async fn create_policy(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(request): Json<CreatePolicyRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    // Verify quote exists and belongs to user
    let quote = crate::db::get_quote_by_id(&state.db, &request.quote_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    if quote.user_id != claims.sub {
        return Err(StatusCode::FORBIDDEN);
    }

    // Create policy
    let policy = crate::db::create_policy(&state.db, &request.quote_id, &claims.sub, &quote.provider)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(policy))
}

pub async fn list_policies(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
) -> Result<impl IntoResponse, StatusCode> {
    let policies = crate::db::list_user_policies(&state.db, &claims.sub)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(policies))
}

