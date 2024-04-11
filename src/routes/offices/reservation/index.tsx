import { createRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Output } from 'valibot';

import { OfficeReservation } from '@/components/office-reservation/OfficeReservation';
import { IndexRoute } from '@/routes/home';
import { useReservationStore } from '@/stores/useReservationStore';

import { BaseRoute } from '../../base';
import {
  OfficeDetailsRoute,
  OfficeDetailsSearchParamsSchema,
} from '../details';
import { fetchOfficeDetailsQuery } from '../details/loader';

const Component = () => {
  const id = OfficeReservationRoute.useParams().id;
  const data = useReservationStore((s) => s.data);

  if (!data) {
    throw redirect({
      to: OfficeDetailsRoute.fullPath,
      params: {
        id,
      },
    });
  }

  return <OfficeReservation />;
};

export type OfficeDetailsSearchParamsType = Output<
  typeof OfficeDetailsSearchParamsSchema
>;

export const OfficeReservationRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(fetchOfficeDetailsQuery({ officeId: id })),
  path: '/offices/$id/reservation',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      toast('You must be logged in to make a reservation');
      throw redirect({
        to: IndexRoute.fullPath,
      });
    }
  },
});
