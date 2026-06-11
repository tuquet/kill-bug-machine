pub mod commands;
pub mod db;
pub mod api;

use commands::credentials;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            
            tauri::async_runtime::spawn(async move {
                if let Ok(app_dir) = app_handle.path().app_data_dir() {
                    if std::fs::create_dir_all(&app_dir).is_ok() {
                        // Initialize database
                        if let Ok(pool) = db::init_db(app_dir).await {
                            // Manage state for Tauri commands
                            app_handle.manage(pool.clone());
                            
                            // Start Axum REST API and Swagger UI on port 1421
                            api::serve(pool, 1421).await;
                        } else {
                            eprintln!("Failed to initialize database");
                        }
                    } else {
                        eprintln!("Failed to create app data dir");
                    }
                } else {
                    eprintln!("Failed to get app data dir");
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            credentials::set_credential,
            credentials::get_credential,
            credentials::delete_credential,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Kill Bug Machine");
}
