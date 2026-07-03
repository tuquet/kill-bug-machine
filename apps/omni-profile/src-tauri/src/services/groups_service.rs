use crate::db::models::groups::{CreateGroup, Group, UpdateGroup};
use omni_shared::error::AppError;
use sqlx::SqlitePool;
use uuid::Uuid;

pub async fn get_groups(pool: &SqlitePool) -> Result<Vec<Group>, AppError> {
    let groups = sqlx::query_as::<_, Group>(
        "SELECT id, name, color, CAST(created_at AS TEXT) as created_at, CAST(updated_at AS TEXT) as updated_at FROM profile_groups ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await?;

    Ok(groups)
}

pub async fn create_group(
    pool: &SqlitePool,
    payload: CreateGroup,
) -> Result<Group, AppError> {
    let new_id = Uuid::new_v4().to_string();

    sqlx::query(
        "INSERT INTO profile_groups (id, name, color) VALUES (?, ?, ?)"
    )
    .bind(&new_id)
    .bind(&payload.name)
    .bind(&payload.color)
    .execute(pool)
    .await?;

    get_group_by_id(pool, &new_id).await
}

pub async fn get_group_by_id(pool: &SqlitePool, id: &str) -> Result<Group, AppError> {
    let group = sqlx::query_as::<_, Group>(
        "SELECT id, name, color, CAST(created_at AS TEXT) as created_at, CAST(updated_at AS TEXT) as updated_at FROM profile_groups WHERE id = ?"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Group with id {} not found", id)))?;

    Ok(group)
}

pub async fn update_group(
    pool: &SqlitePool,
    id: &str,
    payload: UpdateGroup,
) -> Result<Group, AppError> {
    let mut query_parts = Vec::new();

    if payload.name.is_some() {
        query_parts.push("name = ?");
    }
    if payload.color.is_some() {
        query_parts.push("color = ?");
    }

    if query_parts.is_empty() {
        return get_group_by_id(pool, id).await;
    }

    query_parts.push("updated_at = CURRENT_TIMESTAMP");

    let query_str = format!(
        "UPDATE profile_groups SET {} WHERE id = ?",
        query_parts.join(", ")
    );

    let mut query = sqlx::query(&query_str);

    if let Some(ref name) = payload.name {
        query = query.bind(name);
    }
    if let Some(ref color) = payload.color {
        query = query.bind(color);
    }

    query = query.bind(id);
    query.execute(pool).await?;

    get_group_by_id(pool, id).await
}

pub async fn delete_group(pool: &SqlitePool, id: &str) -> Result<(), AppError> {
    sqlx::query("DELETE FROM profile_groups WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}
