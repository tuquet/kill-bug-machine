import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (context.auth.role === 'GUEST') {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: AuthenticatedLayout,
});

import { AppLayout } from '@/app/layout';

function AuthenticatedLayout() {
  return <AppLayout />;
}
