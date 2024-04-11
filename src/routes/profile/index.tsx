import { createRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';

import { BaseRoute } from '../base';

const Component = () => {
  const { t } = useTranslation('navigation');
  const { signOut } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Profile Route</h1>
      <Button onClick={() => signOut(navigate)}>
        {t('navigation:logout')}
      </Button>
    </div>
  );
};

export const ProfileRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/profile',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});
