export const BugSource = {
  GITHUB: 'github',
  JIRA: 'jira',
  GITLAB: 'gitlab',
  LINEAR: 'linear',
  CUSTOM: 'custom',
} as const;

export type BugSource = (typeof BugSource)[keyof typeof BugSource];
