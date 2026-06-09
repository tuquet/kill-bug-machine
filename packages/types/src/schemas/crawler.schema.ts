import { z } from 'zod';
import { bugSourceSchema } from './issue.schema';

export const selectorMapSchema = z.object({
  issueList: z.string().min(1),
  issueLink: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  status: z.string().min(1),
  severity: z.string().optional(),
  labels: z.string().optional(),
  assignee: z.string().optional(),
  createdAt: z.string().optional(),
  nextPage: z.string().optional(),
});

export const crawlAuthSchema = z.object({
  type: z.enum(['cookie', 'form-login', 'header', 'token']),
  credentials: z.record(z.string(), z.string()),
});

export const crawlTargetSchema = z.object({
  url: z.string().url(),
  source: bugSourceSchema,
  repository: z.string().optional(),
  owner: z.string().optional(),
});

export const crawlConfigSchema = z.object({
  target: crawlTargetSchema,
  maxPages: z.number().min(1).max(1000).default(100),
  delayMs: z.number().min(0).max(30000).default(1000),
  maxConcurrency: z.number().min(1).max(10).default(1),
  includeComments: z.boolean().default(true),
  includeAttachments: z.boolean().default(false),
});

export const playwrightCrawlConfigSchema = z.object({
  baseUrl: z.string().url(),
  selectors: selectorMapSchema,
  auth: crawlAuthSchema.optional(),
  delayMs: z.number().min(0).max(30000).default(1000),
  maxConcurrency: z.number().min(1).max(5).default(1),
  maxPages: z.number().min(1).max(500).default(50),
});

export const crawlProgressSchema = z.object({
  jobId: z.string(),
  percent: z.number().min(0).max(100),
  issuesFound: z.number().nonnegative(),
  pagesScanned: z.number().nonnegative(),
  totalPages: z.number().nonnegative().optional(),
  currentUrl: z.string().optional(),
  message: z.string(),
});
