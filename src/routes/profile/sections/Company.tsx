import { createRoute, redirect } from '@tanstack/react-router';

import { ProfileRoute } from '..';

const Component = () => {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
};

export const ProfileCompanyRoute = createRoute({
  getParentRoute: () => ProfileRoute,
  component: Component,
  path: '/company',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});
