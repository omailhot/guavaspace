import './index.css';
import 'react-phone-number-input/style.css';
import './App.css';
import './i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { PageLoader } from './components/loader/PageLoader';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { BaseRoute as RootRoute } from './routes/base';
import { DashboardRoute } from './routes/dashboard';
import { DashboardAdminRoute } from './routes/dashboard/admin';
import { IndexRoute } from './routes/home';
import { OfficesRoute } from './routes/offices';
import { OfficeReservationConfirmationRoute } from './routes/offices/confirmation';
import { CreateOfficeRoute } from './routes/offices/create';
import { OfficeDetailsRoute } from './routes/offices/details';
import { OfficeEditRoute } from './routes/offices/edit';
import { OfficeEditPreviewRoute } from './routes/offices/edit/preview';
import { OfficeEditAmenitiesRoute } from './routes/offices/edit/preview/sections/Amenities';
import { OfficeEditDescriptionRoute } from './routes/offices/edit/preview/sections/Description';
import { OfficeEditImagesRoute } from './routes/offices/edit/preview/sections/Images';
import { OfficeEditRentalOffersRoute } from './routes/offices/edit/rental-offers';
import { OfficeReservationRoute } from './routes/offices/reservation';
import { ProfileRoute } from './routes/profile';
import { UserRoute } from './routes/user';

const routeTree = RootRoute.addChildren([
  IndexRoute,

  ProfileRoute,
  OfficesRoute,
  OfficeEditRoute.addChildren([
    OfficeEditPreviewRoute.addChildren([
      OfficeEditDescriptionRoute,
      OfficeEditAmenitiesRoute,
      OfficeEditImagesRoute,
    ]),
    OfficeEditRentalOffersRoute,
  ]),
  CreateOfficeRoute,
  OfficeDetailsRoute,
  DashboardRoute,
  DashboardAdminRoute,
  UserRoute,
  OfficeReservationRoute,
  OfficeReservationConfirmationRoute,
]);

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 999999999999999,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultStaleTime: 999999999999999,
  defaultPendingComponent: () => <PageLoader />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const auth = useAuthContext();

  return (
    <RouterProvider
      context={{
        queryClient,
        auth,
      }}
      defaultPreload="intent"
      router={router}
    />
  );
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
