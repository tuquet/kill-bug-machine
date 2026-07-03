use crate::api::AppState;
use crate::db::models::groups::{CreateGroup, Group, UpdateGroup};
use crate::services::groups_service;
use axum::{extract::State, Json, Router};
use omni_shared::error::AppError;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", axum::routing::get(get_groups).post(create_group))
        .route(
            "/:id",
            axum::routing::get(get_group)
                .put(update_group)
                .delete(delete_group),
        )
}

#[utoipa::path(
    get,
    path = "/api/groups",
    responses(
        (status = 200, description = "List all profile groups", body = [Group])
    ),
    tag = "groups"
)]
async fn get_groups(State(state): State<AppState>) -> Result<Json<Vec<Group>>, AppError> {
    let groups = groups_service::get_groups(&state.db).await?;
    Ok(Json(groups))
}

#[utoipa::path(
    get,
    path = "/api/groups/{id}",
    responses(
        (status = 200, description = "Get group by ID", body = Group)
    ),
    params(
        ("id" = String, Path, description = "Group ID")
    ),
    tag = "groups"
)]
async fn get_group(
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<Group>, AppError> {
    let group = groups_service::get_group_by_id(&state.db, &id).await?;
    Ok(Json(group))
}

#[utoipa::path(
    post,
    path = "/api/groups",
    request_body = CreateGroup,
    responses(
        (status = 201, description = "Group created", body = Group)
    ),
    tag = "groups"
)]
async fn create_group(
    State(state): State<AppState>,
    Json(payload): Json<CreateGroup>,
) -> Result<Json<Group>, AppError> {
    let group = groups_service::create_group(&state.db, payload).await?;
    Ok(Json(group))
}

#[utoipa::path(
    put,
    path = "/api/groups/{id}",
    request_body = UpdateGroup,
    responses(
        (status = 200, description = "Group updated", body = Group)
    ),
    params(
        ("id" = String, Path, description = "Group ID")
    ),
    tag = "groups"
)]
async fn update_group(
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(payload): Json<UpdateGroup>,
) -> Result<Json<Group>, AppError> {
    let group = groups_service::update_group(&state.db, &id, payload).await?;
    Ok(Json(group))
}

#[utoipa::path(
    delete,
    path = "/api/groups/{id}",
    responses(
        (status = 200, description = "Group deleted")
    ),
    params(
        ("id" = String, Path, description = "Group ID")
    ),
    tag = "groups"
)]
async fn delete_group(
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<serde_json::Value>, AppError> {
    groups_service::delete_group(&state.db, &id).await?;
    Ok(Json(serde_json::json!({ "success": true })))
}
