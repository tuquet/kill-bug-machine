export const IssueSeverity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const;

export type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];
