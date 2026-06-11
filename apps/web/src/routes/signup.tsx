import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignupForm } from '@/features/auth/components/signup-form';

import { authStore } from '@/features/auth/stores/use-auth-store';

export const Route = createFileRoute('/signup')({
  beforeLoad: () => {
    const auth = authStore.state;
    const hasLoggedIn = !!auth.token || !!auth.displayName;
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
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
