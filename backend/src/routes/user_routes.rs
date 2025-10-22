use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use std::sync::Arc;

use crate::{
    auth::Claims,
    db::{ChangePasswordRequest, UpdateUserRequest, UserProfile},
    AppState,
};

pub async fn get_profile(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = crate::db::get_user_by_id(&state.db, &claims.sub)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    Ok(Json(UserProfile::from(user)))
}

pub async fn update_profile(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(request): Json<UpdateUserRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = crate::db::update_user_profile(&state.db, &claims.sub, request)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(UserProfile::from(user)))
}

pub async fn change_password(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(request): Json<ChangePasswordRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    crate::db::change_password(
        &state.db,
        &claims.sub,
        &request.old_password,
        &request.new_password,
    )
    .await
    .map_err(|_| StatusCode::BAD_REQUEST)?;

    Ok(StatusCode::OK)
}

