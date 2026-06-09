import { z } from 'zod';

export const bugSourceSchema = z.enum(['github', 'jira', 'gitlab', 'linear', 'custom']);

export const issueSeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);

export const issueStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed', 'archived']);

export const issueTypeSchema = z.enum(['bug', 'feature', 'task', 'improvement']);

export const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().optional(),
  email: z.string().email().optional(),
});

export const commentSchema = z.object({
  id: z.string(),
  author: personSchema,
  body: z.string(),
  bodyHtml: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  url: z.string().url(),
  mimeType: z.string(),
  size: z.number().nonnegative(),
});

export const repositoryInfoSchema = z.object({
  name: z.string(),
  owner: z.string(),
  url: z.string().url(),
  platform: bugSourceSchema,
});

export const bugIssueSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string(),
  source: bugSourceSchema,
  sourceUrl: z.string().url(),
  title: z.string().min(1).max(500),
  body: z.string(),
  bodyHtml: z.string().optional(),
  severity: issueSeveritySchema,
  status: issueStatusSchema,
  issueType: issueTypeSchema,
  labels: z.array(z.string()),
  author: personSchema,
  assignees: z.array(personSchema),
  repository: repositoryInfoSchema,
  comments: z.array(commentSchema),
  attachments: z.array(attachmentSchema),
  relatedIssues: z.array(z.string()),
  milestone: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  closedAt: z.string().datetime().optional(),
  lastSyncedAt: z.string().datetime(),
  isLocalOnly: z.boolean(),
  isModified: z.boolean(),
  notes: z.string(),
  tags: z.array(z.string()),
});

export const createIssueInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  body: z.string().min(1, 'Body is required'),
  severity: issueSeveritySchema.default('medium'),
  issueType: issueTypeSchema.default('bug'),
  labels: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  notes: z.string().default(''),
  pushToSource: z.boolean().default(false),
});

export const updateIssueInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500).optional(),
  body: z.string().optional(),
  severity: issueSeveritySchema.optional(),
  status: issueStatusSchema.optional(),
  issueType: issueTypeSchema.optional(),
  labels: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const issueFiltersSchema = z.object({
  source: bugSourceSchema.optional(),
  severity: issueSeveritySchema.optional(),
  status: issueStatusSchema.optional(),
  issueType: issueTypeSchema.optional(),
  labels: z.array(z.string()).optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Inferred types from schemas
export type BugIssueSchema = z.infer<typeof bugIssueSchema>;
export type CreateIssueInputSchema = z.infer<typeof createIssueInputSchema>;
export type UpdateIssueInputSchema = z.infer<typeof updateIssueInputSchema>;
export type IssueFiltersSchema = z.infer<typeof issueFiltersSchema>;
