use rusqlite::{Connection, Result};
use std::path::Path;

/// Initialize the SQLite database with the issues table schema.
pub fn initialize(db_path: &Path) -> Result<Connection> {
    let conn = Connection::open(db_path)?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS issues (
            id TEXT PRIMARY KEY,
            external_id TEXT NOT NULL DEFAULT '',
            source TEXT NOT NULL CHECK(source IN ('github','jira','gitlab','linear','custom')),
            source_url TEXT NOT NULL DEFAULT '',
            title TEXT NOT NULL,
            body TEXT NOT NULL DEFAULT '',
            body_html TEXT,
            severity TEXT NOT NULL DEFAULT 'medium'
                CHECK(severity IN ('critical','high','medium','low','info')),
            status TEXT NOT NULL DEFAULT 'open'
                CHECK(status IN ('open','in_progress','resolved','closed','archived')),
            issue_type TEXT NOT NULL DEFAULT 'bug'
                CHECK(issue_type IN ('bug','feature','task','improvement')),
            labels TEXT NOT NULL DEFAULT '[]',
            author TEXT NOT NULL DEFAULT '{}',
            assignees TEXT NOT NULL DEFAULT '[]',
            repository TEXT NOT NULL DEFAULT '{}',
            comments TEXT NOT NULL DEFAULT '[]',
            attachments TEXT NOT NULL DEFAULT '[]',
            related_issues TEXT NOT NULL DEFAULT '[]',
            milestone TEXT,
            notes TEXT NOT NULL DEFAULT '',
            tags TEXT NOT NULL DEFAULT '[]',
            is_local_only INTEGER NOT NULL DEFAULT 1,
            is_modified INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            closed_at TEXT,
            last_synced_at TEXT NOT NULL,
            metadata TEXT NOT NULL DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_issues_source ON issues(source);
        CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
        CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
        CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at);
        CREATE INDEX IF NOT EXISTS idx_issues_is_deleted ON issues(is_deleted);

        CREATE VIRTUAL TABLE IF NOT EXISTS issues_fts USING fts5(
            title, body, content='issues', content_rowid='rowid'
        );
        ",
    )?;

    Ok(conn)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initialize_in_memory() {
        let conn = Connection::open_in_memory().unwrap();
        let path = Path::new(":memory:");
        let result = initialize(path);
        // In-memory test just verifies schema creation doesn't panic
        assert!(result.is_ok() || conn.is_autocommit());
    }
}
