import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // Redirect away from login if already authenticated (any method)
    const hasLoggedIn = !!context.auth.token || !!context.auth.displayName;
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
