use crate::db::models::proxies::{CreateProxy, Proxy, UpdateProxy};
use omni_shared::error::AppError;
use sqlx::SqlitePool;

pub async fn get_proxies(pool: &SqlitePool) -> Result<Vec<Proxy>, AppError> {
    let proxies = sqlx::query_as::<_, Proxy>(
        "SELECT profile_id, proxy_type, host, port, username, password, CAST(created_at AS TEXT) as created_at, CAST(updated_at AS TEXT) as updated_at FROM profile_proxies ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await?;

    Ok(proxies)
}

pub async fn get_proxy_by_id(pool: &SqlitePool, profile_id: &str) -> Result<Proxy, AppError> {
    let proxy = sqlx::query_as::<_, Proxy>(
        "SELECT profile_id, proxy_type, host, port, username, password, CAST(created_at AS TEXT) as created_at, CAST(updated_at AS TEXT) as updated_at FROM profile_proxies WHERE profile_id = ?"
    )
    .bind(profile_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Proxy for profile {} not found", profile_id)))?;

    Ok(proxy)
}

pub async fn create_proxy(
    pool: &SqlitePool,
    payload: CreateProxy,
) -> Result<Proxy, AppError> {
    sqlx::query(
        "INSERT INTO profile_proxies (profile_id, proxy_type, host, port, username, password) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(&payload.profile_id)
    .bind(&payload.proxy_type.unwrap_or_else(|| "HTTP".to_string()))
    .bind(&payload.host)
    .bind(payload.port)
    .bind(&payload.username)
    .bind(&payload.password)
    .execute(pool)
    .await?;

    get_proxy_by_id(pool, &payload.profile_id).await
}

pub async fn update_proxy(
    pool: &SqlitePool,
    profile_id: &str,
    payload: UpdateProxy,
) -> Result<Proxy, AppError> {
    let mut query_parts = Vec::new();

    if payload.proxy_type.is_some() { query_parts.push("proxy_type = ?"); }
    if payload.host.is_some() { query_parts.push("host = ?"); }
    if payload.port.is_some() { query_parts.push("port = ?"); }
    if payload.username.is_some() { query_parts.push("username = ?"); }
    if payload.password.is_some() { query_parts.push("password = ?"); }

    if query_parts.is_empty() {
        return get_proxy_by_id(pool, profile_id).await;
    }

    query_parts.push("updated_at = CURRENT_TIMESTAMP");

    let query_str = format!(
        "UPDATE profile_proxies SET {} WHERE profile_id = ?",
        query_parts.join(", ")
    );

    let mut query = sqlx::query(&query_str);

    if let Some(ref pt) = payload.proxy_type { query = query.bind(pt); }
    if let Some(ref h) = payload.host { query = query.bind(h); }
    if let Some(ref p) = payload.port { query = query.bind(p); }
    if let Some(ref u) = payload.username { query = query.bind(u); }
    if let Some(ref pw) = payload.password { query = query.bind(pw); }

    query = query.bind(profile_id);
    query.execute(pool).await?;

    get_proxy_by_id(pool, profile_id).await
}

pub async fn delete_proxy(pool: &SqlitePool, profile_id: &str) -> Result<(), AppError> {
    sqlx::query("DELETE FROM profile_proxies WHERE profile_id = ?")
        .bind(profile_id)
        .execute(pool)
        .await?;
    Ok(())
}
