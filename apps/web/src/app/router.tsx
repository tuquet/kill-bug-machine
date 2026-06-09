import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const DashboardPage = lazy(() => import('../features/dashboard'));

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

import { AppLayout } from './layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
]);
