import type { BugSource } from '../enums/bug-source.enum';
import type { BugIssue } from './issue.types';

export interface CrawlTarget {
  url: string;
  source: BugSource;
  repository?: string;
  owner?: string;
}

export interface CrawlConfig {
  target: CrawlTarget;
  maxPages?: number;
  delayMs?: number;
  maxConcurrency?: number;
  includeComments?: boolean;
  includeAttachments?: boolean;
}

export interface CrawlJob {
  id: string;
  config: CrawlConfig;
  status: CrawlJobStatus;
  progress: CrawlProgress;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export type CrawlJobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface CrawlProgress {
  jobId: string;
  percent: number;
  issuesFound: number;
  pagesScanned: number;
  totalPages?: number;
  currentUrl?: string;
  message: string;
}

export interface PlaywrightCrawlConfig {
  baseUrl: string;
  selectors: SelectorMap;
  auth?: CrawlAuth;
  delayMs?: number;
  maxConcurrency?: number;
  maxPages?: number;
}

export interface SelectorMap {
  issueList: string;
  issueLink: string;
  title: string;
  body: string;
  status: string;
  severity?: string;
  labels?: string;
  assignee?: string;
  createdAt?: string;
  nextPage?: string;
}

export interface CrawlAuth {
  type: 'cookie' | 'form-login' | 'header' | 'token';
  credentials: Record<string, string>;
}

export interface RawIssue {
  title: string;
  body: string;
  bodyHtml?: string;
  status?: string;
  severity?: string;
  labels?: string[];
  assignee?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  sourceUrl: string;
  externalId?: string;
  comments?: Array<{
    author: string;
    body: string;
    createdAt: string;
  }>;
  metadata?: Record<string, unknown>;
}

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
