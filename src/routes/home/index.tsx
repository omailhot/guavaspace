import { Route } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { BaseRoute } from '../base';

const Component = () => {
  const { t, ready } = useTranslation(['users']);

  if (!ready) {
    return null;
  }

  return (
    <div>
      <h1>Home Route</h1>
      <p>{t('users:user_name')}</p>
    </div>
  );
};

export const IndexRoute = new Route({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/',
});
