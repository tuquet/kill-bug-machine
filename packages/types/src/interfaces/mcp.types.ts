import type { BugSource } from '../enums/bug-source.enum';
import type { IssueSeverity } from '../enums/issue-severity.enum';
import type { IssueStatus } from '../enums/issue-status.enum';

export interface McpServerConfig {
  name: string;
  version: string;
  transport: 'stdio' | 'sse';
  port?: number;
}

export interface McpServerStatus {
  isRunning: boolean;
  pid?: number;
  startedAt?: string;
  transport: 'stdio' | 'sse';
  connectedClients: number;
  toolsRegistered: number;
}

export interface Statistics {
  totalIssues: number;
  bySource: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  recentlyAdded: number;
  recentlyUpdated: number;
  lastCrawlAt?: string;
}

export interface AnalysisResult {
  patterns: Array<{
    pattern: string;
    count: number;
    severity: string;
    examples: string[];
  }>;
  duplicates: Array<{
    issueIds: string[];
    similarity: number;
    reason: string;
  }>;
  trends: Array<{
    period: string;
    created: number;
    resolved: number;
  }>;
}
