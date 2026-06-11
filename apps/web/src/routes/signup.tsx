import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignupForm } from '@/features/auth/components/signup-form';

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    const hasLoggedIn = !!context.auth.token || !!context.auth.displayName;
    if (hasLoggedIn) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
