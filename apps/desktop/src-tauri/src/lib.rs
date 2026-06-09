pub mod commands;
pub mod db;

use commands::issues;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            issues::get_issues,
            issues::get_issue_by_id,
            issues::create_issue,
            issues::update_issue,
            issues::delete_issue,
            issues::get_statistics,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Kill Bug Machine");
}
