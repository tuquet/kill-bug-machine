// Enums (value + type exports)
export { BugSource } from './enums/bug-source.enum';
export { IssueSeverity } from './enums/issue-severity.enum';
export { IssueStatus } from './enums/issue-status.enum';
export { IssueType } from './enums/issue-type.enum';

// Interfaces (type-only exports)
export type {
  Person,
  Attachment,
  Comment,
  RepositoryInfo,
  PaginationParams,
  PaginatedResult,
} from './interfaces/common.types';

export type {
  BugIssue,
  CreateIssueInput,
  UpdateIssueInput,
  IssueFilters,
} from './interfaces/issue.types';

export type {
  CrawlTarget,
  CrawlConfig,
  CrawlJob,
  CrawlJobStatus,
  CrawlProgress,
  PlaywrightCrawlConfig,
  SelectorMap,
  CrawlAuth,
  RawIssue,
  CrawlerPlugin,
} from './interfaces/crawler.types';

export type {
  McpServerConfig,
  McpServerStatus,
  Statistics,
  AnalysisResult,
} from './interfaces/mcp.types';

// Schemas (runtime validation)
export * from './schemas/index';
