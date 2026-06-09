use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct IssueRecord {
    pub id: String,
    pub external_id: String,
    pub source: String,
    pub source_url: String,
    pub title: String,
    pub body: String,
    pub severity: String,
    pub status: String,
    pub issue_type: String,
    pub labels: Vec<String>,
    pub notes: String,
    pub tags: Vec<String>,
    pub is_local_only: bool,
    pub is_modified: bool,
    pub created_at: String,
    pub updated_at: String,
    pub last_synced_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IssueFilters {
    pub source: Option<String>,
    pub severity: Option<String>,
    pub status: Option<String>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateIssueInput {
    pub title: String,
    pub body: String,
    pub severity: String,
    pub issue_type: Option<String>,
    pub labels: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateIssueInput {
    pub id: String,
    pub title: Option<String>,
    pub body: Option<String>,
    pub severity: Option<String>,
    pub status: Option<String>,
    pub issue_type: Option<String>,
    pub labels: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Statistics {
    pub total_issues: u32,
    pub by_source: std::collections::HashMap<String, u32>,
    pub by_severity: std::collections::HashMap<String, u32>,
    pub by_status: std::collections::HashMap<String, u32>,
    pub recently_added: u32,
    pub recently_updated: u32,
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Validation error: {0}")]
    Validation(String),
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

// === Tauri Commands ===

#[tauri::command]
pub async fn get_issues(filters: Option<IssueFilters>) -> Result<Vec<IssueRecord>, AppError> {
    // TODO: Implement SQLite query with filters
    let _ = filters;
    Ok(vec![])
}

#[tauri::command]
pub async fn get_issue_by_id(id: String) -> Result<IssueRecord, AppError> {
    // TODO: Implement SQLite query by ID
    Err(AppError::NotFound(format!("Issue not found: {}", id)))
}

#[tauri::command]
pub async fn create_issue(input: CreateIssueInput) -> Result<IssueRecord, AppError> {
    let now = chrono::Utc::now().to_rfc3339();
    let id = uuid::Uuid::now_v7().to_string();

    Ok(IssueRecord {
        id,
        external_id: String::new(),
        source: "custom".to_string(),
        source_url: String::new(),
        title: input.title,
        body: input.body,
        severity: input.severity,
        status: "open".to_string(),
        issue_type: input.issue_type.unwrap_or_else(|| "bug".to_string()),
        labels: input.labels.unwrap_or_default(),
        notes: input.notes.unwrap_or_default(),
        tags: input.tags.unwrap_or_default(),
        is_local_only: true,
        is_modified: false,
        created_at: now.clone(),
        updated_at: now.clone(),
        last_synced_at: now,
    })
}

#[tauri::command]
pub async fn update_issue(input: UpdateIssueInput) -> Result<IssueRecord, AppError> {
    // TODO: Implement SQLite update
    let _ = input;
    Err(AppError::NotFound("Issue not found".to_string()))
}

#[tauri::command]
pub async fn delete_issue(id: String, hard: Option<bool>) -> Result<bool, AppError> {
    // TODO: Implement soft/hard delete
    let _ = (id, hard);
    Ok(true)
}

#[tauri::command]
pub async fn get_statistics() -> Result<Statistics, AppError> {
    Ok(Statistics {
        total_issues: 0,
        by_source: std::collections::HashMap::new(),
        by_severity: std::collections::HashMap::new(),
        by_status: std::collections::HashMap::new(),
        recently_added: 0,
        recently_updated: 0,
    })
}
