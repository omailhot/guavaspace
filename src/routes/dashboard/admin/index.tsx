import { createRoute, redirect } from '@tanstack/react-router';

import { DashboardCompanyOfficesTable } from '@/components/dashboard/admin/DashboardCompanyOfficesTable';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getFullS3Path } from '@/lib/path';
import { useAuthContext } from '@/contexts/AuthContext';
import { BaseRoute } from '@/routes/base';

import { DashboardRoute } from '..';
import { fetchCompanyOfficesQuery } from './loader';

const Component = () => {
  const { managerProfile } = useAuthContext();
  return (
    <DashboardLayout>
      <div className="py-4 md:py-12">
        <DashboardCompanyOfficesTable />
      </div>
      <img
        alt={managerProfile?.company.companyName}
        className="mx-auto"
        src={getFullS3Path(managerProfile?.company.companyLogoPath || '')}
      />
    </DashboardLayout>
  );
};

export const DashboardAdminRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/dashboard/admin',
  loader: async (opts) =>
    opts.context.queryClient.ensureQueryData(
      fetchCompanyOfficesQuery({
        companyId: opts.context.auth.managerProfile?.company.companyId || '',
      }),
    ),
  beforeLoad: ({ context }) => {
    if (!context.auth.managerProfile) {
      throw redirect({
        to: DashboardRoute.fullPath,
      });
    }
  },
});
