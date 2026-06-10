import { createFileRoute } from '@tanstack/react-router';
import DashboardFeature from '@/features/dashboard';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return <DashboardFeature />;
}
