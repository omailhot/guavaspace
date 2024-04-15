import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';
import { DashboardRoute } from '@/routes/dashboard';
import { DashboardAdminRoute } from '@/routes/dashboard/admin';

import { ProfileDropdown } from '../../navigation/ProfileDropdown';

export const DashboardMobileNavigation = () => {
  const { t } = useTranslation(['navigation', 'dashboard']);
  const { managerProfile } = useAuthContext();
  return (
    <nav className="fixed bottom-0 mx-auto flex h-20 w-full items-center justify-center overflow-hidden bg-white text-slate-500 focus:text-primary md:hidden">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn('cursor-pointer', navigationMenuTriggerStyle())}
            >
              <Link
                activeOptions={{ exact: true }}
                className="focus:bg-transparent [&.active]:text-primary"
                to={DashboardRoute.fullPath}
              >
                <div className="gap-2 text-xs">
                  <LayoutDashboard className="mx-auto" strokeWidth={1.5} />
                  {t('dashboard:rentals')}
                </div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {managerProfile ? (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  activeOptions={{ exact: true }}
                  className="focus:bg-transparent [&.active]:text-primary"
                  to={DashboardAdminRoute.fullPath}
                >
                  <div className="gap-2 text-xs">
                    <Pencil className="mx-auto" strokeWidth={1.5} />
                    {t('dashboard:admin.title')}
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : null}
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <ProfileDropdown />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
