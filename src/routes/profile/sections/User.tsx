import { createRoute, redirect } from '@tanstack/react-router';

import { ProfileRoute } from '..';

const Component = () => {
  return (
    <div>
      <h2>User</h2>
    </div>
  );
};

export const ProfileUserRoute = createRoute({
  getParentRoute: () => ProfileRoute,
  component: Component,
  path: '/',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});
