import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@kbm/ui';
import { queryClient } from './app/query-client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import './app/globals.css';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools router={router} position="bottom-right" />
    </QueryClientProvider>
  );
}
