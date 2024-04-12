import {
  createRoute,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { CircleUser } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Menu, SubNav } from '../../components/menu/Menu';
import { MainLayout } from '../../layouts/MainLayout';
import { BaseRoute } from '../base';

const Component = () => {
  const { t } = useTranslation(['edit_office', 'office']);

  const router = useRouterState();
  const navigate = useNavigate({ from: ProfileRoute.fullPath });

  useEffect(() => {
    const redirectUrls = ['/edit', '/edit/'];

    if (redirectUrls.some((url) => router.location.pathname.endsWith(url))) {
      navigate({
        // Need to keep the `/` to avoid the route from being matched
        to: '/profile/user/',
      });
    }
  }, [navigate, router.location.pathname]);

  return (
    <MainLayout>
      <div className="mx-auto flex w-full flex-col lg:grid lg:max-w-[1920px] lg:grid-cols-[20%_80%]">
        <Menu title={t('edit_office:sub_nav_panel.title')}>
          <SubNav
            icon={<CircleUser />}
            params={{}}
            search={{}}
            text={t('edit_office:sub_nav_panel.links.description.label')}
            to="/profile/user/"
          />
        </Menu>
        <div className="h-body lg:mt-5">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export const ProfileRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/profile/user',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});
