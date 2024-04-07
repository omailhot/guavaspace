import { createRoute } from '@tanstack/react-router';

import { OfficeEditImagesSection } from '../../../../../components/office-edit/sections/images/OfficeEditImagesSection';
import { OfficeEditPreviewRoute } from '..';

const Component = () => {
  return (
    <div>
      <OfficeEditImagesSection />
    </div>
  );
};

export const OfficeEditImagesRoute = createRoute({
  getParentRoute: () => OfficeEditPreviewRoute,
  component: Component,
  path: '/images',
});
