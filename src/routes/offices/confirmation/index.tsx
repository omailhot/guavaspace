import { createRoute } from '@tanstack/react-router';

import { OfficeReservationConfirmation } from '@/components/office-reservation/confirmation/OfficeReservationConfirmation';
import { BaseRoute } from '@/routes/base';

import { fetchOfficeDetailsQuery } from '../details/loader';

const Component = () => {
  const office = OfficeReservationConfirmationRoute.useLoaderData();
  return <OfficeReservationConfirmation office={office} />;
};

export const OfficeReservationConfirmationRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(fetchOfficeDetailsQuery({ officeId: id })),
  path: '/offices/$id/reservation/confirmation',
});
