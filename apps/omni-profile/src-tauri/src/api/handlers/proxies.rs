use crate::api::AppState;
use crate::db::models::proxies::{CreateProxy, Proxy, UpdateProxy};
use crate::services::proxies_service;
use axum::{extract::State, Json, Router};
use omni_shared::error::AppError;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", axum::routing::get(get_proxies).post(create_proxy))
        .route(
            "/:profile_id",
            axum::routing::get(get_proxy)
                .put(update_proxy)
                .delete(delete_proxy),
        )
}

#[utoipa::path(
    get,
    path = "/api/proxies",
    responses(
        (status = 200, description = "List all proxies", body = [Proxy])
    ),
    tag = "proxies"
)]
async fn get_proxies(State(state): State<AppState>) -> Result<Json<Vec<Proxy>>, AppError> {
    let proxies = proxies_service::get_proxies(&state.db).await?;
    Ok(Json(proxies))
}

#[utoipa::path(
    get,
    path = "/api/proxies/{profile_id}",
    responses(
        (status = 200, description = "Get proxy by profile ID", body = Proxy)
    ),
    params(
        ("profile_id" = String, Path, description = "Profile ID")
    ),
    tag = "proxies"
)]
async fn get_proxy(
    State(state): State<AppState>,
    axum::extract::Path(profile_id): axum::extract::Path<String>,
) -> Result<Json<Proxy>, AppError> {
    let proxy = proxies_service::get_proxy_by_id(&state.db, &profile_id).await?;
    Ok(Json(proxy))
}

#[utoipa::path(
    post,
    path = "/api/proxies",
    request_body = CreateProxy,
    responses(
        (status = 201, description = "Proxy created", body = Proxy)
    ),
    tag = "proxies"
)]
async fn create_proxy(
    State(state): State<AppState>,
    Json(payload): Json<CreateProxy>,
) -> Result<Json<Proxy>, AppError> {
    let proxy = proxies_service::create_proxy(&state.db, payload).await?;
    Ok(Json(proxy))
}

#[utoipa::path(
    put,
    path = "/api/proxies/{profile_id}",
    request_body = UpdateProxy,
    responses(
        (status = 200, description = "Proxy updated", body = Proxy)
    ),
    params(
        ("profile_id" = String, Path, description = "Profile ID")
    ),
    tag = "proxies"
)]
async fn update_proxy(
    State(state): State<AppState>,
    axum::extract::Path(profile_id): axum::extract::Path<String>,
    Json(payload): Json<UpdateProxy>,
) -> Result<Json<Proxy>, AppError> {
    let proxy = proxies_service::update_proxy(&state.db, &profile_id, payload).await?;
    Ok(Json(proxy))
}

#[utoipa::path(
    delete,
    path = "/api/proxies/{profile_id}",
    responses(
        (status = 200, description = "Proxy deleted")
    ),
    params(
        ("profile_id" = String, Path, description = "Profile ID")
    ),
    tag = "proxies"
)]
async fn delete_proxy(
    State(state): State<AppState>,
    axum::extract::Path(profile_id): axum::extract::Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    proxies_service::delete_proxy(&state.db, &profile_id).await?;
    Ok(Json(serde_json::json!({ "success": true })))
}
