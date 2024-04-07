import './index.css';
import 'react-phone-number-input/style.css';
import './App.css';
import './i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { PageLoader } from './components/loader/PageLoader';
import { BaseRoute as RootRoute } from './routes/base';
import { IndexRoute } from './routes/home';
import { OfficesRoute } from './routes/offices';
import { CreateOfficeRoute } from './routes/offices/create';
import { OfficeDetailsRoute } from './routes/offices/details';
import { OfficeEditRoute } from './routes/offices/edit';
import { OfficeEditPreviewRoute } from './routes/offices/edit/preview';
import { OfficeEditAmenitiesRoute } from './routes/offices/edit/preview/sections/Amenities';
import { OfficeEditDescriptionRoute } from './routes/offices/edit/preview/sections/Description';
import { OfficeEditImagesRoute } from './routes/offices/edit/preview/sections/Images';
import { OfficeEditRentalOffersRoute } from './routes/offices/edit/rental-offers';
import { ProfileRoute } from './routes/profile';
import { UserRoute } from './routes/user';

const routeTree = RootRoute.addChildren([
  IndexRoute,
  OfficeEditRoute.addChildren([
    OfficeEditPreviewRoute.addChildren([
      OfficeEditDescriptionRoute,
      OfficeEditAmenitiesRoute,
      OfficeEditImagesRoute,
    ]),
    OfficeEditRentalOffersRoute,
  ]),
  OfficesRoute,
  CreateOfficeRoute,
  ProfileRoute,
  OfficeDetailsRoute,
  UserRoute,
]);

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 999999999999999,
  context: {
    queryClient,
  },
  defaultStaleTime: 999999999999999,
  defaultPendingComponent: () => <PageLoader />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
