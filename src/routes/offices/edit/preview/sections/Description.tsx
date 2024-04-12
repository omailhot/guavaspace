import { createRoute } from '@tanstack/react-router';

import { OfficeEditDescriptionSection } from '../../../../../components/office-edit/sections/OfficeEditDescriptionSection';
import { OfficeEditPreviewRoute } from '..';

const Component = () => {
  return <OfficeEditDescriptionSection />;
};

export const OfficeEditDescriptionRoute = createRoute({
  getParentRoute: () => OfficeEditPreviewRoute,
  component: Component,
  path: '/',
});
