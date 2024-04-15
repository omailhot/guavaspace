import {
  createRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { CalendarDays, ClipboardList, Image, Text } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Menu, SubNav } from '../../../components/menu/Menu';
import { MainLayout } from '../../../layouts/MainLayout';
import { BaseRoute } from '../../base';
import { OfficeEditAmenitiesRoute } from './preview/sections/Amenities';
import { OfficeEditImagesRoute } from './preview/sections/Images';
import { OfficeEditRentalOffersRoute } from './rental-offers';

const Component = () => {
  const { t } = useTranslation(['edit_office', 'office']);

  const officeId = OfficeEditRoute.useParams().id;

  const router = useRouterState();
  const navigate = useNavigate({ from: OfficeEditRoute.fullPath });

  useEffect(() => {
    const redirectUrls = ['/edit', '/edit/'];

    if (redirectUrls.some((url) => router.location.pathname.endsWith(url))) {
      navigate({
        // Need to keep the `/` to avoid the route from being matched
        to: '/offices/$id/edit/preview/',
        params: { id: officeId },
        search: {},
      });
    }
  }, [navigate, officeId, router.location.pathname]);

  return (
    <MainLayout>
      <div className="mx-auto flex w-full flex-col lg:grid lg:max-w-[1920px] lg:grid-cols-[20%_80%]">
        <Menu title={t('edit_office:sub_nav_panel.title')}>
          <SubNav
            icon={<Text />}
            params={{ id: officeId }}
            search={{}}
            text={t('edit_office:sub_nav_panel.links.description.label')}
            // Need to keep the `/` to avoid the route from being matched
            to="/offices/$id/edit/preview/"
          />
          <SubNav
            icon={<ClipboardList />}
            params={{ id: officeId }}
            search={{}}
            text={t('edit_office:sub_nav_panel.links.features.label')}
            to={OfficeEditAmenitiesRoute.fullPath}
          />
          <SubNav
            icon={<Image />}
            params={{ id: officeId }}
            search={{}}
            text={t('edit_office:sub_nav_panel.links.images.label')}
            to={OfficeEditImagesRoute.fullPath}
          />
          <SubNav
            icon={<CalendarDays />}
            params={{ id: officeId }}
            search={{}}
            text={t('edit_office:sub_nav_panel.links.rental_offers.label')}
            to={OfficeEditRentalOffersRoute.fullPath}
          />
        </Menu>
        <div className="h-body lg:mt-5">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export const OfficeEditRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/offices/$id/edit',
});
