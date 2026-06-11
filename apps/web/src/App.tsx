import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider, Toaster } from '@kbm/ui';
import { ThemeProvider } from 'next-themes';
import { queryClient } from './app/query-client';
import { ErrorBoundary } from '@/components/error-boundary';
import { ConfirmDialogProvider } from '@/components/confirm-dialog';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import './app/globals.css';

// Create a new router instance
import { useStore } from '@tanstack/react-store';
import { authStore, authActions } from '@/features/auth/stores/use-auth-store';
import { useEffect } from 'react';
import { isDesktop } from '@/utils/platform';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { toast } from 'sonner';
import { DEFAULT_AUTHENTICATED_ROUTE } from '@/config/route-config';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // We'll provide it in the RouterProvider
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export default function App() {
  const auth = useStore(authStore);

  // Handle OAuth Deep Links in Tauri Desktop App
  useEffect(() => {
    if (!isDesktop()) return;

    let unlisten: () => void;
    
    onOpenUrl((urls) => {
      const urlStr = urls[0];
      if (!urlStr) return;
      
      try {
        const url = new URL(urlStr);
        // Expecting kbm://auth/callback?code=...
        if (url.host === 'auth' && url.pathname.includes('/callback')) {
          const code = url.searchParams.get('code');
          if (code) {
             // Simulate backend exchanging code for token
             authActions.setAuth('ADMIN', 'mock-github-token', 'GitHub User');
             toast.success('Đăng nhập GitHub thành công qua Deep Link!');
             
             // Navigate to dashboard
             router.navigate({ to: DEFAULT_AUTHENTICATED_ROUTE });
          }
        }
      } catch (err) {
        console.error('Failed to parse deep link:', err);
      }
    }).then((u) => { unlisten = u; }).catch(console.error);

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <ConfirmDialogProvider>
              <RouterProvider router={router} context={{ auth }} />
            </ConfirmDialogProvider>
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <TanStackRouterDevtools router={router} position="bottom-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
