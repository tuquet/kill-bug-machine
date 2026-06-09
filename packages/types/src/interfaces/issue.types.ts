import type { BugSource } from '../enums/bug-source.enum';
import type { IssueSeverity } from '../enums/issue-severity.enum';
import type { IssueStatus } from '../enums/issue-status.enum';
import type { IssueType } from '../enums/issue-type.enum';
import type { Person, Comment, Attachment, RepositoryInfo } from './common.types';

export interface BugIssue {
  // Identity
  id: string;
  externalId: string;
  source: BugSource;
  sourceUrl: string;

  // Content
  title: string;
  body: string;
  bodyHtml?: string;

  // Classification
  severity: IssueSeverity;
  status: IssueStatus;
  issueType: IssueType;
  labels: string[];

  // People
  author: Person;
  assignees: Person[];

  // Repository
  repository: RepositoryInfo;

  // Metadata
  comments: Comment[];
  attachments: Attachment[];
  relatedIssues: string[];
  milestone?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  lastSyncedAt: string;

  // Local
  isLocalOnly: boolean;
  isModified: boolean;
  notes: string;
  tags: string[];
}

export interface CreateIssueInput {
  title: string;
  body: string;
  severity: IssueSeverity;
  issueType?: IssueType;
  labels?: string[];
  tags?: string[];
  notes?: string;
  pushToSource?: boolean;
}

export interface UpdateIssueInput {
  id: string;
  title?: string;
  body?: string;
  severity?: IssueSeverity;
  status?: IssueStatus;
  issueType?: IssueType;
  labels?: string[];
  tags?: string[];
  notes?: string;
  assignees?: Person[];
}

export interface IssueFilters {
  source?: BugSource;
  severity?: IssueSeverity;
  status?: IssueStatus;
  issueType?: IssueType;
  labels?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
