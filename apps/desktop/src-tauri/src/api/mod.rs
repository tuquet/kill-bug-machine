use axum::{Router, routing::get, response::IntoResponse, Json};
use sqlx::SqlitePool;
use std::net::SocketAddr;
use tokio::net::TcpListener;
use utoipa::OpenApi;
use utoipa_scalar::{Scalar, Servable};

#[derive(Clone)]
pub struct AppState {
    pub db: SqlitePool,
}

#[derive(OpenApi)]
#[openapi(
    paths(
        health_check,
        ping
    ),
    tags(
        (name = "health", description = "Health check endpoints")
    )
)]
struct ApiDoc;

pub async fn serve(pool: SqlitePool, port: u16) {
    let state = AppState { db: pool };

    let app = Router::new()
        .merge(Scalar::with_url("/scalar", ApiDoc::openapi()))
        .route("/health", get(health_check))
        .route("/ping", get(ping))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("API Server running on http://{}", addr);

    if let Ok(listener) = TcpListener::bind(addr).await {
        let _ = axum::serve(listener, app).await;
    } else {
        eprintln!("Failed to bind to port {}", port);
    }
}

#[utoipa::path(
    get,
    path = "/health",
    responses(
        (status = 200, description = "Returns health status of the API")
    )
)]
async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "service": "kbm-backend"
    }))
}

#[utoipa::path(
    get,
    path = "/ping",
    responses(
        (status = 200, description = "Returns pong")
    )
)]
async fn ping() -> &'static str {
    "pong"
}
