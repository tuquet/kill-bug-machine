import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
// removed AppLayout
import type { AuthState } from '@/features/auth/stores/use-auth-store';

interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
