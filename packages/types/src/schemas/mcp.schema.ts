import { z } from 'zod';

export const mcpServerConfigSchema = z.object({
  name: z.string().default('kill-bug-machine'),
  version: z.string().default('1.0.0'),
  transport: z.enum(['stdio', 'sse']).default('stdio'),
  port: z.number().min(1024).max(65535).optional(),
});

export const mcpServerStatusSchema = z.object({
  isRunning: z.boolean(),
  pid: z.number().optional(),
  startedAt: z.string().datetime().optional(),
  transport: z.enum(['stdio', 'sse']),
  connectedClients: z.number().nonnegative(),
  toolsRegistered: z.number().nonnegative(),
});

export const statisticsSchema = z.object({
  totalIssues: z.number().nonnegative(),
  bySource: z.record(z.string(), z.number()),
  bySeverity: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  recentlyAdded: z.number().nonnegative(),
  recentlyUpdated: z.number().nonnegative(),
  lastCrawlAt: z.string().datetime().optional(),
});
