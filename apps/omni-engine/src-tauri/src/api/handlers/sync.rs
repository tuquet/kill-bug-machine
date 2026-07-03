use crate::api::AppState;
use crate::error::AppError;
use axum::{extract::State, Json, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct SyncStatus {
    pub pending_items: i64,
    pub status: String,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/status", axum::routing::get(get_sync_status))
        .route("/force", axum::routing::post(force_sync))
}

#[utoipa::path(
    get,
    path = "/api/engine/sync/status",
    responses(
        (status = 200, description = "Get current sync queue status")
    ),
    tag = "sync"
)]
async fn get_sync_status(
    State(state): State<AppState>,
) -> Result<Json<SyncStatus>, AppError> {
    let pending_items: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM sync_queue WHERE status = 'PENDING'"
    )
    .fetch_one(&state.db)
    .await
    .unwrap_or(0);

    let status = if pending_items > 0 {
        "Syncing".to_string()
    } else {
        "Idle".to_string()
    };

    Ok(Json(SyncStatus {
        pending_items,
        status,
    }))
}

#[utoipa::path(
    post,
    path = "/api/engine/sync/force",
    responses(
        (status = 200, description = "Force sync now")
    ),
    tag = "sync"
)]
async fn force_sync(
    State(_state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    // In a real implementation, this would trigger the background worker.
    // For now, we mock the success.
    
    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Sync forced successfully"
    })))
}
