import { createRoute, useNavigate } from '@tanstack/react-router';
import { Marker } from '@vis.gl/react-google-maps';
import * as v from 'valibot';

import { GoogleMap } from '@/components/google-map/Map';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { RentalPreviews } from '@/components/rental-preview/RentalPreviews';
import { SearchForm } from '@/components/search/SearchForm';
import { MainLayout } from '@/layouts/MainLayout';
import { SearchSchema } from '@/types/Search';

import { BaseRoute } from '../base';
import { fetchRentalPreviewsQuery } from '../home/loader';
import { OfficeDetailsRoute } from './details';

const Component = () => {
  const rentalPreviews = OfficesRoute.useLoaderData();
  const searchParams = OfficesRoute.useSearch();
  const navigate = useNavigate({ from: OfficesRoute.fullPath });
  return (
    <MainLayout>
      <div className="sticky z-50 hidden bg-white md:top-[var(--nav-height)] md:flex">
        <SearchForm
          className="container md:py-4"
          from={OfficesRoute.fullPath}
        />
      </div>
      {searchParams.location.lat && searchParams.location.lng ? (
        <div className="flex flex-col gap-6 md:flex-row-reverse md:pr-0">
          <GoogleMap
            center={
              searchParams.location.lat && searchParams.location.lng
                ? {
                    lat: searchParams.location.lat,
                    lng: searchParams.location.lng,
                  }
                : undefined
            }
            className="top-0 flex h-64 w-full translate-x-0 transform overflow-hidden rounded-b-none bg-white transition-transform delay-300 duration-300 ease-in-out md:sticky md:h-screen md:w-2/5 md:rounded-r-none"
          >
            {rentalPreviews.map((rentalPreview, index) => (
              <Marker
                key={index}
                onClick={() =>
                  navigate({
                    to: OfficeDetailsRoute.fullPath,
                    params: { id: rentalPreview.office.officeId },
                  })
                }
                position={{
                  lat: rentalPreview.office.officeAddress.latitude,
                  lng: rentalPreview.office.officeAddress.longitude,
                }}
              />
            ))}
          </GoogleMap>
          <RentalPreviews
            className="px-6 pb-6 sm:grid-cols-2 md:w-3/5 md:pl-8 md:pr-0 xl:grid-cols-3"
            rentalPreviews={rentalPreviews}
          />
        </div>
      ) : (
        <RentalPreviews
          className="container pb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          rentalPreviews={rentalPreviews}
        />
      )}
      <MobileNavigation from={OfficesRoute.fullPath} />
    </MainLayout>
  );
};

export type OfficesParams = v.Output<typeof SearchSchema>;

export const OfficesRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/offices',
  validateSearch: (search) => {
    return v.parse(SearchSchema, search);
  },
  loaderDeps: ({ search }) => ({
    search,
  }),
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      fetchRentalPreviewsQuery(opts.deps.search),
    ),
});
