import './index.css';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { AboutRoute } from './routes/about';
import { BaseRoute as RootRoute } from './routes/base';
import { IndexRoute } from './routes/home';
import { PostsRoute } from './routes/posts';

const routeTree = RootRoute.addChildren([IndexRoute, AboutRoute, PostsRoute]);

const queryClient = new QueryClient();

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
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
