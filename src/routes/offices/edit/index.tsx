import {
  createRoute,
  Link,
  type LinkProps,
  Outlet,
  type RegisteredRouter,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { CalendarDays, ClipboardList, Image, Text } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { MainLayout } from '../../../layouts/MainLayout';
import { cn } from '../../../lib/utils';
import { BaseRoute } from '../../base';
import { OfficeEditAmenitiesRoute } from './preview/sections/Amenities';
import { OfficeEditImagesRoute } from './preview/sections/Images';
import { OfficeEditRentalOffersRoute } from './rental-offers';

type SubNavProps = LinkProps<RegisteredRouter['routeTree']> & {
  icon: React.ReactNode;
  text: string;
};

const SubNav = ({ className, icon, text, ...props }: SubNavProps) => {
  return (
    <Link
      className={cn(
        className,
        'justi flex flex-col items-center justify-start gap-3 rounded-md px-3 py-1.5 lg:flex-row [&.active]:bg-primary [&.active]:text-white',
      )}
      {...props}
    >
      <div>{icon}</div>
      <div className="text-xs md:text-base">{text}</div>
    </Link>
  );
};

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
        <div className="flex flex-col p-5 lg:h-body lg:items-center">
          <Card className="flex h-full w-full flex-col">
            <CardContent className="p-0">
              <CardHeader className="border-b">
                <CardTitle>{t('edit_office:sub_nav_panel.title')}</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-row justify-center gap-1.5 p-1.5 lg:flex-col">
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
                  text={t(
                    'edit_office:sub_nav_panel.links.rental_offers.label',
                  )}
                  to={OfficeEditRentalOffersRoute.fullPath}
                />
              </CardBody>
            </CardContent>
          </Card>
        </div>
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
