import { createLazyFileRoute } from '@tanstack/react-router';
import { AppLauncher } from '@/features/launcher/components/app-launcher';

export const Route = createLazyFileRoute('/_authenticated/launcher')({
  component: AppLauncher,
});
