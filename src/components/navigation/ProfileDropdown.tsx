import { useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import {
  CircleUserRound,
  Globe,
  LayoutDashboard,
  LogOut,
  Pencil,
  PlusSquare,
  UserCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/contexts/AuthContext';
import { DashboardRoute } from '@/routes/dashboard';
import { DashboardAdminRoute } from '@/routes/dashboard/admin';
import { CreateOfficeRoute } from '@/routes/offices/create';

import { ProfileUserRoute } from '../../routes/profile/sections/User';
import { CognitoUserType } from '../../types/User';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const avatarFallback = (user: CognitoUserType) => {
  return user.given_name[0].toUpperCase() + user.family_name[0].toUpperCase();
};

export const ProfileDropdown = () => {
  const { user, managerProfile, signOut, startAuthFlow } = useAuthContext();
  const { i18n } = useTranslation('navigation');
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="ml-auto flex gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button className="hidden md:flex" variant="outline">
              <div className="flex items-center gap-3">
                <span className="font-bold">{user?.given_name}</span>
                <Avatar
                  style={{
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <AvatarImage alt={user?.given_name ?? 'N/A'} />
                  <AvatarFallback className="bg-primary text-white">
                    {avatarFallback(user)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
            <Button
              className="flex h-full flex-col text-muted-foreground hover:text-foreground hover:no-underline md:hidden"
              variant="link"
            >
              <CircleUserRound size={24} />
              <span className="text-xs">{user?.given_name}</span>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {managerProfile ? (
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: CreateOfficeRoute.fullPath,
                })
              }
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              {t('navigation:create-rental')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => startAuthFlow({ isCreatedCompany: true })}
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              {t('navigation:create-company')}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate({ to: ProfileUserRoute.fullPath })}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            {t('navigation:profile')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate({ to: DashboardRoute.fullPath })}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {t('navigation:user-dashboard')}
          </DropdownMenuItem>
          {managerProfile ? (
            <>
              <DropdownMenuItem
                onClick={() => navigate({ to: DashboardAdminRoute.fullPath })}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t('navigation:admin-dashboard')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem onClick={() => signOut(navigate as any)}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('navigation:logout')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')
            }
          >
            <Globe className="mr-2 h-4 w-4" />
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
