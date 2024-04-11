import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ProfileDropdown } from '@/components/navigation/ProfileDropdown';
import { Navbar } from '@/components/ui/navbar';
import { useAuthContext } from '@/contexts/AuthContext';
import { DashboardRoute } from '@/routes/dashboard';
import { DashboardAdminRoute } from '@/routes/dashboard/admin';

import { Logo } from '../../navigation/Logo';

export const DashboardNavigation = () => {
  const { t } = useTranslation(['dashboard', 'navigation']);
  const { user, managerProfile } = useAuthContext();
  return (
    <Navbar>
      <div className="container mx-auto flex h-full items-center justify-center">
        <div className="mr-auto flex gap-3">
          <Logo />
        </div>
        <div className="flex h-full items-center gap-6 font-medium text-muted-foreground">
          <Link
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'text-primary border-b-2 border-primary',
            }}
            className="flex h-full items-center pt-2 hover:border-b-2 hover:border-primary"
            inactiveProps={{ className: 'border-b-2 border-transparent' }}
            to={DashboardRoute.fullPath}
          >
            {t('dashboard:rentals')}
          </Link>
          {managerProfile ? (
            <Link
              activeOptions={{ exact: true }}
              activeProps={{
                className: 'text-primary border-b-2 border-primary',
              }}
              className="flex h-full items-center pt-2 hover:border-b-2 hover:border-primary"
              inactiveProps={{ className: 'border-b-2 border-transparent' }}
              to={DashboardAdminRoute.fullPath}
            >
              {t('dashboard:admin.title')}
            </Link>
          ) : null}
        </div>
        {user ? <ProfileDropdown /> : <div className="w-full" />}
      </div>
    </Navbar>
  );
};
