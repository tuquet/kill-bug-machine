import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/app/layout';

import { authStore } from '@/features/auth/stores/use-auth-store';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    // Read directly from store to avoid React render cycle race condition
    const auth = authStore.state;
    const hasLoggedIn = !!auth.token || !!auth.displayName;
    if (!hasLoggedIn) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <AppLayout />;
}
