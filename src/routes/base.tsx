import { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import { Suspense } from 'react';

import { FullPageLoader } from '../components/loader/FullPageLoader';
import { Toaster } from '../components/ui/sonner';
import { AuthContextType } from '../contexts/AuthContext';

export const BaseRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContextType;
}>()({
  component: () => (
    <Suspense>
      <Suspense fallback={<FullPageLoader />}>
        <ScrollRestoration />
        <Outlet />
      </Suspense>
      <Toaster richColors theme="light" />
    </Suspense>
  ),
});
