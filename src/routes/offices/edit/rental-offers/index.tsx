import { useSuspenseQuery } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { OfficeEditRentalsSection } from '../../../../components/office-edit/sections/OfficeEditRentalsSection';
import { useOfficeEditStore } from '../../../../stores/useOfficeEditStore';
import { fetchOfficeDetailsQuery } from '../../details/loader';
import { OfficeEditRoute } from '..';

const Component = () => {
  const init = useOfficeEditStore((s) => s.init);

  const officeId = OfficeEditRentalOffersRoute.useParams().id;

  const officeQuery = useSuspenseQuery(
    fetchOfficeDetailsQuery({ officeId: officeId }),
  );

  const default_office = officeQuery.data;

  useEffect(() => {
    init('EDIT', default_office);
  }, [default_office, init]);

  return (
    <div className="w-full">
      <div className="flex max-h-body flex-col gap-10 overflow-y-auto">
        <OfficeEditRentalsSection />
      </div>
    </div>
  );
};

export const OfficeEditRentalOffersRoute = createRoute({
  getParentRoute: () => OfficeEditRoute,
  component: Component,
  path: '/rental-offers',
});
