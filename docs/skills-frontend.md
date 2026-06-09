# Frontend Skills Reference — Kill Bug Machine

> Tài liệu chuẩn về kỹ năng, patterns, và conventions cho toàn bộ frontend codebase.

---

## 1. Core Skills

### React 19
- **Server Components awareness** — Hiểu khi nào client vs server (dù Tauri là client-only)
- **Hooks mastery** — `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useTransition`
- **Custom Hooks** — Tách logic thành reusable hooks, đặt trong `hooks/` folder
- **Error Boundaries** — Wrap mọi feature module với error boundary
- **Suspense** — Lazy loading routes, code-splitting per feature
- **Compound Components** — Pattern cho complex UI (Modal, Select, DataTable)
- **Render Props & HOC** — Khi cần share behavior across components
- **Ref Forwarding** — `React.forwardRef` cho UI library components

### TypeScript Strict Mode
- **No `any` policy** — Mọi variable, param, return phải có type
- **Discriminated Unions** — Cho state machines, MCP command types
- **Generic Components** — `DataTable<T>`, `Select<TOption>`, `Form<TSchema>`
- **Zod Schema Inference** — `z.infer<typeof schema>` thay vì duplicate interfaces
- **Utility Types** — `Pick`, `Omit`, `Partial`, `Required`, `Record`
- **Path Aliases** — `@/features/`, `@kbm/ui`, `@kbm/core`
- **Strict tsconfig** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

---

## 2. State Management

### Zustand (Client State)
```typescript
// Pattern: Feature-scoped store with typed actions
interface IssueFilterStore {
  filters: IssueFilters;
  setFilter: (key: keyof IssueFilters, value: unknown) => void;
  resetFilters: () => void;
}

export const useIssueFilterStore = create<IssueFilterStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    { name: 'issue-filters' }
  )
);
```

**Rules:**
- 1 store per feature domain (issue-store, crawler-store, settings-store)
- Barrel export qua `index.ts`
- Dùng `persist` middleware cho state cần lưu lại
- Không lưu server data trong Zustand → dùng TanStack Query

### TanStack Query (Server State)
```typescript
// Pattern: Query key factory + typed hooks
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: IssueFilters) => [...issueKeys.lists(), filters] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  detail: (id: string) => [...issueKeys.details(), id] as const,
};

export function useIssues(filters: IssueFilters) {
  return useQuery({
    queryKey: issueKeys.list(filters),
    queryFn: () => issueService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: issueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
  });
}
```

**Rules:**
- Query keys centralized trong `query-keys.ts`
- `staleTime` > 0 cho data ít thay đổi
- Optimistic updates cho CRUD operations
- `useInfiniteQuery` cho paginated lists

### React Hook Form + Zod (Form State)
```typescript
// Pattern: Zod schema → Form → Validated submission
const issueFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1),
  severity: issueSeveritySchema,
  labels: z.array(z.string()),
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

function IssueForm() {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: { title: '', body: '', severity: 'medium', labels: [] },
  });
  // ...
}
```

---

## 3. UI & Styling

### Tailwind CSS 4.0
- **CSS-first config** — `@theme` directive thay vì `tailwind.config.js`
- **Design tokens** — CSS custom properties cho colors, spacing, radius
- **Dark mode** — `class` strategy, toggle via Zustand store
- **Responsive** — Mobile-first nhưng focus desktop (Tauri)
- **`cn()` utility** — Merge class names với `clsx` + `tailwind-merge`

### Shadcn/ui + Radix UI
- **Component ownership** — Copy components vào `packages/ui`, customize freely
- **Radix primitives** — Accessible by default (keyboard, screen reader)
- **Compound Components** — `<Dialog>`, `<Select>`, `<DropdownMenu>` composable API
- **Variant pattern** — `cva()` cho component variants (size, color, state)
- **Slot pattern** — `asChild` prop cho custom rendering

### Framer Motion
- **Page transitions** — `AnimatePresence` + `motion.div` trên route changes
- **Layout animations** — `layout` prop cho sidebar collapse/expand
- **Micro-interactions** — Hover scale, press feedback, loading spinners
- **Stagger** — List item animations khi data loads
- **Exit animations** — Smooth remove khi delete items

---

## 4. Architecture Patterns

### Feature-Sliced Design
```
features/
├── dashboard/
│   ├── components/     # UI components (React)
│   ├── hooks/          # Feature-specific hooks
│   └── index.ts        # Public API only
```

**Rules:**
- Mỗi feature là 1 folder tự chứa
- Import giữa features PHẢI qua `index.ts` (barrel export)
- Không import trực tiếp từ `features/other-feature/components/...`
- Shared code nằm trong `shared/` hoặc `packages/`

### Component Hierarchy
1. **Primitives** (`@kbm/ui`) — Button, Input, Badge, Card
2. **Composites** (`@kbm/ui`) — DataTable, CommandPalette, FilterBar
3. **Feature Components** (`features/`) — IssueTable, CrawlProgress
4. **Pages** (`features/`) — DashboardPage, IssueListPage

### Import Boundaries
```typescript
// ✅ ALLOWED
import { Button } from '@kbm/ui';
import { useIssues } from '@kbm/core';
import { BugIssue } from '@kbm/types';

// ✅ ALLOWED — same feature
import { IssueFilters } from './IssueFilters';

// ❌ FORBIDDEN — cross-feature deep import
import { CrawlProgress } from '../crawler/components/CrawlProgress';

// ✅ ALLOWED — cross-feature via public API
import { CrawlProgress } from '../crawler';
```

---

## 5. Performance Patterns

### Code Splitting
```typescript
// Lazy load routes
const DashboardPage = lazy(() => import('./features/dashboard'));
const IssuesPage = lazy(() => import('./features/issues'));
const CrawlerPage = lazy(() => import('./features/crawler'));
```

### Memoization Strategy
- `React.memo` — DataTable rows, list items, expensive renders
- `useMemo` — Filtered/sorted data, computed values
- `useCallback` — Event handlers passed to memoized children
- **Không lạm dụng** — Chỉ dùng khi profiler cho thấy bottleneck

### Virtualization
- `@tanstack/react-virtual` cho danh sách issues > 100 items
- Virtual scrolling trong DataTable

---

## 6. Accessibility (a11y)

### Checklist mọi component phải đáp ứng
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Focus management (visible focus ring, focus trap in modals)
- [ ] ARIA labels cho interactive elements
- [ ] Screen reader announcements cho dynamic content
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Reduced motion support (`prefers-reduced-motion`)

### Tools
- Radix UI handles most a11y automatically
- `eslint-plugin-jsx-a11y` cho static analysis
- Manual testing với keyboard-only navigation

---

## 7. Tauri IPC Integration

### Frontend → Backend (Commands)
```typescript
import { invoke } from '@tauri-apps/api/core';

// Type-safe invoke wrapper
export async function getIssues(filters: IssueFilters): Promise<BugIssue[]> {
  return invoke<BugIssue[]>('get_issues', { filters });
}
```

### Backend → Frontend (Events)
```typescript
import { listen } from '@tauri-apps/api/event';

// Listen for crawler progress
useEffect(() => {
  const unlisten = listen<CrawlerProgress>('crawler:progress', (event) => {
    updateProgress(event.payload);
  });
  return () => { unlisten.then(fn => fn()); };
}, []);
```

### Backend → Frontend (Channels — streaming)
```typescript
import { Channel } from '@tauri-apps/api/core';

// Stream issues one by one during crawl
const channel = new Channel<BugIssue>();
channel.onmessage = (issue) => {
  addIssueToStore(issue);
};
await invoke('crawl_issues', { config, onEvent: channel });
```

---

## 8. Testing Strategy

### Unit Tests (Vitest)
- Component tests với `@testing-library/react`
- Hook tests với `renderHook`
- Service tests với mocked Tauri invoke

### Integration Tests
- Feature-level tests (mount page, interact, verify)
- TanStack Query tests với `QueryClientProvider`

### E2E Tests (Future)
- Playwright cho desktop app testing
- Test critical flows: create issue, crawl, search
