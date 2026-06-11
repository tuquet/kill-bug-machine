import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';

import { authStore } from '@/features/auth/stores/use-auth-store';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Read directly from store to avoid React render cycle race condition
    const auth = authStore.state;
    const hasLoggedIn = !!auth.token || !!auth.displayName;
    if (hasLoggedIn) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
