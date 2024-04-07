import { Link } from '@tanstack/react-router';
import { Building2, CircleUserRound, Home, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/Contexts/AuthContext';
import { cn } from '@/lib/utils';

import { IndexRoute } from '../../../routes/home';
import { ProfileRoute } from '../../../routes/profile';
import { Button } from '../../ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../../ui/navigation-menu';
import { SearchForm } from '../Search/SearchForm';

type Props = {
  from: string;
};

export const MobileNavigation = ({ from }: Props) => {
  const { t } = useTranslation('navigation');
  const { user, startAuthFlow } = useAuthContext();

  return (
    <nav className="fixed bottom-0 mx-auto flex h-20 w-full items-center justify-center overflow-hidden bg-white text-slate-500 focus:text-primary md:hidden">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link
                className="focus:bg-transparent [&.active]:text-primary"
                to={IndexRoute.fullPath}
              >
                <div className="text-xs">
                  <Home className="mx-auto" size={24} />
                  {t('navigation:home')}
                </div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn('cursor-pointer', navigationMenuTriggerStyle())}
            >
              <SearchForm from={from}>
                <div className="text-xs">
                  <Search className="mx-auto" size={24} />
                  {t('navigation:explore')}
                </div>
              </SearchForm>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Button
                className="bg-transparent text-xs text-slate-500 hover:bg-transparent focus:bg-transparent"
                onClick={() => startAuthFlow({ isCreatedCompany: true })}
              >
                <div className="gap-2 text-xs">
                  <Building2 className="mx-auto" strokeWidth={1.5} />
                  {t('navigation:rent')}
                </div>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              {user ? (
                <Link
                  className="focus:bg-transparent [&.active]:text-primary"
                  to={ProfileRoute.fullPath}
                >
                  <div className="gap-2 text-xs">
                    <CircleUserRound className="mx-auto" strokeWidth={1.5} />
                    {t('navigation:profile')}
                  </div>
                </Link>
              ) : (
                <Button
                  className="bg-transparent text-xs text-slate-500 hover:bg-transparent focus:bg-transparent"
                  onClick={() => startAuthFlow()}
                >
                  <div className="gap-2 text-xs">
                    <CircleUserRound className="mx-auto" strokeWidth={1.5} />
                    {t('navigation:login')}
                  </div>
                </Button>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
