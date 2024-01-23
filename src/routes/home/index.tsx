import { Route } from '@tanstack/react-router';

import { BaseRoute } from '../base';

const Component = () => {
  return (
    <div>
      <h1>Home Route</h1>
    </div>
  );
};

export const IndexRoute = new Route({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/',
});
