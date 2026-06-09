export const IssueType = {
  BUG: 'bug',
  FEATURE: 'feature',
  TASK: 'task',
  IMPROVEMENT: 'improvement',
} as const;

export type IssueType = (typeof IssueType)[keyof typeof IssueType];
