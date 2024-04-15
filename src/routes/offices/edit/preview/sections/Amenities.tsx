import { createRoute } from '@tanstack/react-router';

import { OfficeEditAmenitiesSection } from '../../../../../components/office-edit/sections/features/OfficeEditAmenitiesSection';
import { OfficeEditPreviewRoute } from '..';

const Component = () => {
  return (
    <div>
      <OfficeEditAmenitiesSection />
    </div>
  );
};

export const OfficeEditAmenitiesRoute = createRoute({
  getParentRoute: () => OfficeEditPreviewRoute,
  component: Component,
  path: '/features',
});
