import { Route } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/Contexts/AuthContext';

import { BaseRoute } from '../base';

const Component = () => {
  const { t } = useTranslation('navigation');
  const { signOut } = useAuthContext();

  return (
    <div>
      <h1>Profile Route</h1>
      <Button onClick={() => signOut()}>{t('navigation:logout')}</Button>
    </div>
  );
};

export const ProfileRoute = new Route({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/profile',
});
