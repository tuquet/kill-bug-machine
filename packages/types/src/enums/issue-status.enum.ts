export const IssueStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];
