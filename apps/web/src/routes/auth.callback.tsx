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
  const isDesktopFlow = state === 'desktop';

  useEffect(() => {
    if (!code) {
      toast.error('Không tìm thấy mã xác thực từ GitHub.');
      navigate({ to: '/login' });
      return;
    }

    if (!isDesktopFlow) {
      toast.info('Đang xác thực với GitHub...');
      // Simulate API verification
      setTimeout(() => {
        authActions.setAuth('USER', `github-token-${code}`);
        toast.success('Đăng nhập GitHub thành công!');
        navigate({ to: '/dashboard' });
      }, 1500);
    }
  }, [code, navigate, isDesktopFlow]);

  if (isDesktopFlow) {
    const deepLinkUrl = `kbm://auth/callback?code=${code}`;
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 bg-background text-foreground">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Xác thực thành công</h1>
            <p className="text-sm text-muted-foreground">
              Tài khoản GitHub của bạn đã được kết nối. Trình duyệt đã sẵn sàng trả bạn về ứng dụng Kill Bug Machine.
            </p>
          </div>
          <a
            href={deepLinkUrl}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Mở Ứng dụng Desktop
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Lưu ý: Trình duyệt sẽ yêu cầu quyền mở ứng dụng. Hãy nhấn "Cho phép" (Allow). <br /><br />
            Nếu báo lỗi "scheme does not have a registered handler" (thường gặp khi dev trên Windows), hãy thử chạy lại command <code>pnpm tauri dev</code> bằng Terminal có quyền Administrator để hệ thống đăng ký Deep Link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-muted-foreground text-sm font-medium">Đang xử lý đăng nhập GitHub...</p>
      </div>
    </div>
  );
}
