import { useSuspenseQuery } from '@tanstack/react-query';
import { createRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { parse } from 'valibot';

import { OfficeDetails } from '../../../../components/office-details/OfficeDetails';
import { useOfficeEditStore } from '../../../../stores/useOfficeEditStore';
import { OfficeDetailsSearchParamsSchema } from '../../details';
import { fetchOfficeDetailsQuery } from '../../details/loader';
import { OfficeEditRoute } from '..';

const Component = () => {
  const init = useOfficeEditStore((s) => s.init);
  const updatedOffice = useOfficeEditStore((s) => s.office);
  const isInitialized = useOfficeEditStore((s) => s.isInitialized);

  const officeId = OfficeEditPreviewRoute.useParams().id;

  const officeQuery = useSuspenseQuery(
    fetchOfficeDetailsQuery({ officeId: officeId }),
  );

  const default_office = officeQuery.data;

  useEffect(() => {
    init('EDIT', default_office);
  }, [default_office, init]);

  return (
    <div className="grid grid-cols-[100%] lg:grid-cols-[30%_70%]">
      <div className="flex max-h-body flex-1 flex-col gap-10 overflow-y-auto pb-10 md:mx-5 lg:mx-0">
        <Outlet />
      </div>
      <div className="relative hidden max-h-body w-full overflow-y-auto lg:grid">
        <OfficeDetails
          className="col-[1_/_span_2] row-[1_/_span_2] origin-top scale-75"
          isEdit
          office={isInitialized ? updatedOffice : default_office}
        />
        <div className="absolute left-0 top-0 col-[1_/_span_2] row-[1_/_span_2] h-full w-full opacity-0" />
      </div>
    </div>
  );
};

export const OfficeEditPreviewRoute = createRoute({
  getParentRoute: () => OfficeEditRoute,
  component: Component,
  path: '/preview',
  validateSearch: (search) => parse(OfficeDetailsSearchParamsSchema, search),
});
