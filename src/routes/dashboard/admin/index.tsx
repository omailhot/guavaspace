import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DashboardCompanyOfficesTable } from '@/components/dashboard/admin/DashboardCompanyOfficesTable';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getFullS3Path } from '@/lib/path';
import { BaseRoute } from '@/routes/base';

import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { useManagerProfile } from '../../../hooks/useManagerProfile';
import { fetchCompanyOfficesQuery } from './loader';

const Component = () => {
  const managerProfile = useManagerProfile();

  const { t } = useTranslation('profile');

  return (
    <DashboardLayout>
      <div className="flex flex-col-reverse items-start gap-5 md:mt-12 md:flex-row">
        <DashboardCompanyOfficesTable className="flex w-full md:w-2/3" />
        <div className="flex w-full  flex-col gap-5 md:w-1/3">
          <Card className="flex h-full w-full flex-col">
            <CardContent className="p-0">
              <CardHeader className="border-b">
                <CardTitle>{t('dashboard:admin.company_title')}</CardTitle>
              </CardHeader>
              <CardBody className="grid gap-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {managerProfile.company.companyName}
                    </h3>
                  </div>
                  <img
                    className="rounded-md"
                    src={getFullS3Path(managerProfile.company.companyLogoPath)}
                  />
                </div>
              </CardBody>
            </CardContent>
          </Card>
        </div>
      </div>
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
    context.auth.ensureManager();
  },
});
