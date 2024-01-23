import { Route } from '@tanstack/react-router';

import { BaseRoute } from '../base';

const Component = () => {
  return (
    <div>
      <h1>About Route</h1>
    </div>
  );
};

export const AboutRoute = new Route({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/about',
});
