# 🐛 Kill Bug Machine

> **Cross-platform Desktop DevTool** — Crawl, manage, và expose bugs qua MCP cho AI agents tự động xử lý.

![Tauri](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-06b6d4?logo=tailwindcss)

## Architecture

| Package | Description |
|:---|:---|
| `apps/desktop` | Tauri v2 desktop shell (Rust backend) |
| `apps/web` | React + Vite frontend |
| `packages/ui` | Shadcn/Radix UI component library (`@kbm/ui`) |
| `packages/core` | Business logic — Zustand + TanStack Query (`@kbm/core`) |
| `packages/types` | Shared TypeScript types + Zod schemas (`@kbm/types`) |
| `packages/crawler` | Playwright-based bug crawler engine (`@kbm/crawler`) |
| `packages/mcp-server` | MCP server for AI agent integration (`@kbm/mcp-server`) |
| `packages/config` | Shared ESLint, TypeScript, Prettier configs (`@kbm/config`) |

## Quick Start

```bash
# Install dependencies
pnpm install

# Run frontend dev server
pnpm --filter @kbm/web dev

# Run Tauri desktop app
pnpm --filter @kbm/desktop tauri dev

# Build all
pnpm turbo build
```

## Tech Stack

- **Desktop:** Tauri v2 (Rust)
- **Frontend:** React 19 + Vite 6 + Tailwind CSS 4
- **UI:** Shadcn/ui + Radix UI
- **State:** Zustand (client) + TanStack Query (server)
- **Validation:** Zod
- **Database:** SQLite (encrypted)
- **Crawler:** Playwright
- **AI Integration:** MCP (Model Context Protocol)
- **Monorepo:** pnpm + Turborepo

## License

MIT
