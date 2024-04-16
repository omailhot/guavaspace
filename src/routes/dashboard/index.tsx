import { createRoute } from '@tanstack/react-router';

import { DashboardRentalsTable } from '@/components/dashboard/DashboardRentalsTable';
import { DashboardLayout } from '@/layouts/DashboardLayout';

import { BaseRoute } from '../base';
import { fetchRentalsQuery } from './loader';

const Component = () => {
  return (
    <DashboardLayout>
      <DashboardRentalsTable className="relative mt-12" />
    </DashboardLayout>
  );
};

export const DashboardRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/dashboard',
  loader: async (opts) =>
    opts.context.queryClient.ensureQueryData(fetchRentalsQuery()),
  beforeLoad: ({ context }) => {
    context.auth.ensureConnected();
  },
});
