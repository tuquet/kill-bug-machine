import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { authActions } from '@/features/auth/stores/use-auth-store';
import { toast } from 'sonner';
import { z } from 'zod';

const searchSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
}).catch({});

export const Route = createFileRoute('/auth/callback')({
  validateSearch: searchSchema,
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { code, state } = Route.useSearch();

  useEffect(() => {
    if (code) {
      if (state === 'desktop') {
        // We are inside the external browser but the login originated from the Desktop app.
        // Bounce the flow back to the Desktop app via deep link!
        toast.info('Đang chuyển hướng về ứng dụng Desktop...');
        window.location.href = `kbm://auth/callback?code=${code}`;
        return;
      }

      toast.info('Đang xác thực với GitHub...');
      // Simulate API verification
      setTimeout(() => {
        authActions.setAuth('USER', `github-token-${code}`);
        toast.success('Đăng nhập GitHub thành công!');
        navigate({ to: '/dashboard' });
      }, 1500);
    } else {
      toast.error('Không tìm thấy mã xác thực từ GitHub.');
      navigate({ to: '/login' });
    }
  }, [code, navigate]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-muted-foreground text-sm font-medium">Đang xử lý đăng nhập GitHub...</p>
      </div>
    </div>
  );
}
