import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, rootRouteWithContext } from '@tanstack/react-router';
import React, { Suspense } from 'react';

import { Navigation } from '@/components/Navigation/Navigation';

import { Loading } from '../components/Loading';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const BaseRoute = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <Suspense fallback={<Loading />}>
        <Navigation />
        <Outlet />
      </Suspense>
      <Suspense fallback={<span>Loading ...</span>}>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools
          buttonPosition="bottom-left"
          initialIsOpen={false}
        />
      </Suspense>
    </>
  ),
});
