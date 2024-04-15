import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Branding } from '@/components/header/Branding';
import { MobileNavigation } from '@/components/header/Navigation/MobileNavigation';
import { SearchForm } from '@/components/header/Search/SearchForm';
import { Listing } from '@/components/listing/Listing';
import { MainLayout } from '@/layouts/MainLayout';

import { BaseRoute } from '../base';
import { fetchRentalPreviewsQuery } from './loader';

const Component = () => {
  const { ready } = useTranslation();
  const rentalPreviews = IndexRoute.useLoaderData();

  if (!ready) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container">
        <Branding />
        <div className="sticky z-50 hidden bg-white pb-4 md:top-[var(--nav-height)] md:flex">
          <SearchForm className="w-full md:pt-4" from={IndexRoute.fullPath} />
        </div>
        <Listing
          className="pb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          rentalPreviews={rentalPreviews}
        />
      </div>
      <MobileNavigation from={IndexRoute.fullPath} />
    </MainLayout>
  );
};

export const IndexRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/',
  loader: async (opts) =>
    opts.context.queryClient.ensureQueryData(
      fetchRentalPreviewsQuery(undefined),
    ),
});
