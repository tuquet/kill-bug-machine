# Architecture

## Overview

```
kill-bug-machine/
├── apps/
│   ├── desktop/        → Tauri v2 shell + Rust Axum backend
│   └── web/            → React 19 + Vite 6 frontend
├── packages/
│   ├── config/         → Shared ESLint, TypeScript, Prettier configs
│   ├── types/          → Shared TypeScript type definitions
│   └── ui/             → shadcn/ui component library (56 components)
└── docs/               → VitePress documentation
```

## Packages

### `apps/desktop`

The Tauri v2 desktop shell. Contains a Rust backend (`src-tauri/`) that:

- Initializes a SQLite database via sqlx
- Starts an Axum HTTP server on port 8080
- Exposes OpenAPI documentation via Scalar at `/scalar`
- Provides Tauri IPC commands for credential management

### `apps/web`

The React frontend bundled by Vite. Uses:

- React Router for client-side routing with lazy-loaded pages
- shadcn/ui components from `@kbm/ui`
- Zustand for client state, TanStack Query for server state

### `packages/ui`

All 56 shadcn/ui components pre-installed and ready to import:

```tsx
import { Button } from '@kbm/ui/components/ui/button';
import { Sidebar, SidebarProvider } from '@kbm/ui/components/ui/sidebar';
```

The `cn()` utility is available for conditional class merging:

```tsx
import { cn } from '@kbm/ui';
```

### `packages/config`

Shared configuration files for ESLint 9 (flat config), TypeScript (strict mode), and Prettier.

### `packages/types`

Shared TypeScript type definitions used across the monorepo.

## API

The Axum backend exposes the following endpoints:

| Method | Path      | Description                  |
| :----- | :-------- | :--------------------------- |
| GET    | `/health` | Health check (returns JSON)  |
| GET    | `/ping`   | Simple ping (returns "pong") |
| GET    | `/scalar` | OpenAPI documentation UI     |

Add new routes in `apps/desktop/src-tauri/src/api/mod.rs`.
