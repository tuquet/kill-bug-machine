# Backend Skills Reference — Kill Bug Machine

> Tài liệu chuẩn về kỹ năng, patterns, và conventions cho backend (Rust + Node.js).

---

## 1. Rust / Tauri v2

### Tauri Commands (IPC)
```rust
// Pattern: Typed command with error handling
#[tauri::command]
async fn get_issues(
    state: tauri::State<'_, AppState>,
    filters: IssueFilters,
) -> Result<Vec<BugIssue>, AppError> {
    let db = state.db.lock().await;
    let issues = db.query_issues(&filters).await?;
    Ok(issues)
}
```

**Rules:**
- Mọi command trả về `Result<T, AppError>` — không panic
- Sử dụng `tauri::State` cho shared state (DB connection, config)
- Async commands cho I/O operations
- `#[specta::specta]` decorator cho auto TypeScript bindings

### Tauri Events (Push notifications)
```rust
// Pattern: Emit progress events
app_handle.emit("crawler:progress", CrawlerProgress {
    job_id: job.id.clone(),
    percent: 75,
    issues_found: 42,
    message: "Scanning page 3/4...".into(),
})?;
```

### Tauri Channels (High-throughput streaming)
```rust
use tauri::ipc::Channel;

#[tauri::command]
async fn crawl_issues(
    config: CrawlConfig,
    on_event: Channel<BugIssue>,
) -> Result<CrawlSummary, AppError> {
    for issue in crawler.crawl(&config).await {
        on_event.send(issue)?; // Stream each issue
    }
    Ok(summary)
}
```

### Tauri v2 Security (Capabilities)
```json
// src-tauri/capabilities/main-window.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "store:default",
    "sql:default",
    "shell:allow-spawn",
    "dialog:default",
    "notification:default"
  ]
}
```

**Rules:**
- Principle of Least Privilege — chỉ grant permissions cần thiết
- Mỗi window có capability riêng
- Custom permissions cho plugin-specific operations

### Error Handling
```rust
// Pattern: Custom error type serializable to frontend
#[derive(Debug, thiserror::Error, serde::Serialize)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    
    #[error("Credential not found: {0}")]
    CredentialNotFound(String),
    
    #[error("Crawler error: {0}")]
    Crawler(String),
    
    #[error("MCP error: {0}")]
    Mcp(String),
}

// Auto-convert from rusqlite errors
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
}
```

---

## 2. Database (SQLCipher)

### Connection Management
```rust
use rusqlite::Connection;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn open(path: &Path, key: &str) -> Result<Self, AppError> {
        let conn = Connection::open(path)?;
        conn.pragma_update(None, "key", key)?;
        conn.pragma_update(None, "cipher_page_size", 4096)?;
        Ok(Self { conn })
    }
}
```

### Migration Pattern
```sql
-- migrations/001_create_issues.sql
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    external_id TEXT,
    source TEXT NOT NULL CHECK(source IN ('github','jira','gitlab','custom')),
    source_url TEXT,
    title TEXT NOT NULL,
    body TEXT,
    body_html TEXT,
    severity TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    issue_type TEXT NOT NULL DEFAULT 'bug',
    labels TEXT, -- JSON array
    author TEXT, -- JSON object
    assignees TEXT, -- JSON array
    repository TEXT, -- JSON object
    comments TEXT, -- JSON array
    notes TEXT DEFAULT '',
    tags TEXT, -- JSON array
    is_local_only INTEGER DEFAULT 0,
    is_modified INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    closed_at TEXT,
    last_synced_at TEXT,
    metadata TEXT -- JSON object for extensibility
);

CREATE INDEX idx_issues_source ON issues(source);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_created_at ON issues(created_at);

-- Full-text search
CREATE VIRTUAL TABLE issues_fts USING fts5(
    title, body, content='issues', content_rowid='rowid'
);
```

### Query Patterns
```rust
// Pattern: Parameterized queries with filters
pub fn query_issues(&self, filters: &IssueFilters) -> Result<Vec<BugIssue>> {
    let mut sql = String::from("SELECT * FROM issues WHERE is_deleted = 0");
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = vec![];

    if let Some(source) = &filters.source {
        sql.push_str(" AND source = ?");
        params.push(Box::new(source.clone()));
    }
    if let Some(status) = &filters.status {
        sql.push_str(" AND status = ?");
        params.push(Box::new(status.clone()));
    }
    // ...
}
```

---

## 3. Credential Management

### OS Keyring Integration
```rust
use tauri_plugin_keyring::KeyringExt;

#[tauri::command]
async fn store_credential(
    app: tauri::AppHandle,
    service: String,
    key: String,
    value: String,
) -> Result<(), AppError> {
    app.keyring()
        .set_password(&service, &key, &value)
        .map_err(|e| AppError::CredentialNotFound(e.to_string()))?;
    Ok(())
}

#[tauri::command]
async fn get_credential(
    app: tauri::AppHandle,
    service: String,
    key: String,
) -> Result<String, AppError> {
    app.keyring()
        .get_password(&service, &key)
        .map_err(|e| AppError::CredentialNotFound(e.to_string()))
}
```

### Storage Mapping
| Platform | Backend | Encryption |
|:---|:---|:---|
| Windows | Credential Manager (DPAPI) | AES-256 |
| macOS | Keychain | Hardware-backed |
| Linux | Secret Service (GNOME Keyring) | User-session |

---

## 4. MCP Server (TypeScript / Node.js)

### Server Setup
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'kill-bug-machine',
  version: '1.0.0',
});
```

### Tool Registration Pattern
```typescript
// Pattern: Zod-validated tool with structured response
server.registerTool(
  'get_all_issues',
  {
    title: 'Get All Issues',
    description: 'Retrieve all tracked bug issues with optional filters',
    inputSchema: {
      source: z.enum(['github', 'jira', 'gitlab', 'custom']).optional()
        .describe('Filter by bug source'),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).optional()
        .describe('Filter by severity'),
      status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional()
        .describe('Filter by status'),
      limit: z.number().min(1).max(500).default(50)
        .describe('Max results to return'),
    },
  },
  async ({ source, severity, status, limit }) => {
    const issues = await issueRepository.getAll({ source, severity, status, limit });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(issues, null, 2),
      }],
    };
  }
);
```

### Critical Rules
- **NEVER** use `console.log` in stdio mode → corrupts JSON-RPC
- Use `console.error` (stderr) for logging
- Every Zod field MUST have `.describe()` → LLM reads these
- Return both human-readable text and structured data
- Test with MCP Inspector: `npx @modelcontextprotocol/inspector`

### Resource Pattern
```typescript
server.registerResource(
  'issues://list',
  {
    title: 'All Issues',
    description: 'Read-only list of all tracked issues',
    mimeType: 'application/json',
  },
  async () => {
    const issues = await issueRepository.getAll({});
    return {
      contents: [{
        uri: 'issues://list',
        mimeType: 'application/json',
        text: JSON.stringify(issues),
      }],
    };
  }
);
```

---

## 5. Crawler Engine (TypeScript + Playwright)

### Plugin Interface
```typescript
export interface CrawlerPlugin<TConfig = unknown> {
  readonly name: string;
  readonly source: BugSource;
  readonly version: string;

  initialize(config: TConfig): Promise<void>;
  crawl(target: CrawlTarget): AsyncGenerator<RawIssue, void, undefined>;
  transform(raw: RawIssue): BugIssue;
  validate(issue: BugIssue): boolean;
  destroy(): Promise<void>;
}
```

### Playwright Crawler Pattern
```typescript
import { chromium, type Browser, type Page } from 'playwright';

export class PlaywrightCrawler {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--no-sandbox'],
    });
  }

  async *crawl(config: PlaywrightCrawlConfig): AsyncGenerator<RawIssue> {
    const context = await this.browser!.newContext({
      userAgent: 'KBM-Crawler/1.0',
    });
    const page = await context.newPage();

    // Navigate to issue list
    await page.goto(config.baseUrl);
    await page.waitForLoadState('networkidle');

    // Extract issue links
    const links = await page.$$eval(
      config.selectors.issueLink,
      (els) => els.map((el) => el.getAttribute('href'))
    );

    // Visit each issue page
    for (const link of links) {
      if (!link) continue;
      await page.goto(new URL(link, config.baseUrl).toString());
      await page.waitForLoadState('networkidle');

      yield {
        title: await page.$eval(config.selectors.title, (el) => el.textContent?.trim() ?? ''),
        body: await page.$eval(config.selectors.body, (el) => el.innerHTML),
        status: await page.$eval(config.selectors.status, (el) => el.textContent?.trim() ?? ''),
        // ... extract more fields
        sourceUrl: page.url(),
      };

      // Rate limiting
      if (config.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, config.delayMs));
      }
    }

    await context.close();
  }

  async destroy(): Promise<void> {
    await this.browser?.close();
  }
}
```

### Rate Limiting & Error Handling
```typescript
// Pattern: Exponential backoff with max retries
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}
```

---

## 6. Monorepo Patterns

### Package Dependencies
```json
// Dùng workspace protocol cho internal packages
{
  "dependencies": {
    "@kbm/types": "workspace:*",
    "@kbm/core": "workspace:*",
    "@kbm/ui": "workspace:*"
  }
}
```

### Turborepo Pipeline
```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

### Shared Configs
- TypeScript: `packages/config/tsconfig/base.json` → extend everywhere
- ESLint: `packages/config/eslint/index.mjs` → import everywhere
- Prettier: `packages/config/prettier/index.mjs` → reference in root

---

## 7. MCP Process Management (Tauri → Node.js)

### Spawning MCP Server from Tauri
```rust
use tauri_plugin_shell::ShellExt;

#[tauri::command]
async fn start_mcp_server(app: tauri::AppHandle) -> Result<(), AppError> {
    let sidecar = app.shell()
        .sidecar("kbm-mcp-server")
        .map_err(|e| AppError::Mcp(e.to_string()))?;
    
    let (mut rx, child) = sidecar
        .spawn()
        .map_err(|e| AppError::Mcp(e.to_string()))?;

    // Store child process handle for cleanup
    // ...
    Ok(())
}
```

### Process Lifecycle
1. **Start** — User clicks "Start MCP" → Tauri spawns Node.js process
2. **Monitor** — Health check via stdout heartbeat
3. **Stop** — User clicks "Stop MCP" → Tauri kills child process
4. **Auto-restart** — Crashed → auto-restart with backoff

---

## 8. Testing Strategy

### Rust Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_issue_query_with_filters() {
        let db = Database::open_in_memory().unwrap();
        db.run_migrations().unwrap();
        // Insert test data, query, assert
    }
}
```

### MCP Server Tests
```bash
# Test with MCP Inspector (interactive)
npx @modelcontextprotocol/inspector node packages/mcp-server/dist/index.js

# Automated tool tests
vitest run packages/mcp-server/src/__tests__/
```

### Crawler Tests
- Mock Playwright với test HTML pages
- Test transformers with fixture data
- Integration test với live GitHub API (staging)
