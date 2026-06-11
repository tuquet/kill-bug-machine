import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/app/layout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    // Allow access if: has token (USER/ADMIN) OR has displayName (Guest login)
    const hasLoggedIn = !!context.auth.token || !!context.auth.displayName;
    if (!hasLoggedIn) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <AppLayout />;
}
