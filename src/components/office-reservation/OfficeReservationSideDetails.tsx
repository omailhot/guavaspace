import { redirect } from '@tanstack/react-router';
import { differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';

import { getFullS3Path } from '@/lib/path';
import { cn, getLowestRankPicturePath } from '@/lib/utils';
import { useRentOffice } from '@/mutations/useRentOffice';
import { useOfficeReservation } from '@/queries/useOfficeReservation';
import {
  OfficeDetailsRoute,
  OfficeDetailsSearchParamsSchemaWithDefaults,
} from '@/routes/offices/details';
import { OfficeReservationRoute } from '@/routes/offices/reservation';
import { useReservationStore } from '@/stores/useReservationStore';
import { OfficeType } from '@/types/Office';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ReservationTotalSection } from './sections/ReservationTotalSection';

const DataPickerSchema = v.object({});

export type DataPickerType = v.Output<typeof DataPickerSchema>;

type Props = {
  className?: string;
  office: OfficeType;
};

export const OfficeReservationSideDetails = ({ className, office }: Props) => {
  const { t } = useTranslation('reservation');
  const mutation = useRentOffice();

  const params = OfficeReservationRoute.useParams();

  const seachParams = OfficeReservationRoute.useSearch();

  const searchWithDefaults = v.parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    seachParams,
  );

  const query = useOfficeReservation({
    officeId: params.id,
    searchParams: searchWithDefaults,
  });

  const data = useReservationStore((s) => s.data);

  if (!data) {
    redirect({
      to: OfficeDetailsRoute.fullPath,
      params: {
        id: params.id,
      },
    });
    return;
  }

  const totalDays = differenceInDays(data.to, data.from);

  const isLoading = mutation.isPending || query.isPending;

  if (query.isError) {
    return <div>{query.error.message}</div>;
  }

  const rentalPrice = query.data?.rentalPrice ?? 0;

  const totalPrice = totalDays * data.seats * rentalPrice;

  return (
    <aside className="h-fit rounded-md border p-4 shadow-sm">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none">
        <div className="flex">
          <img
            alt={office.officeName}
            className="h-28 rounded-md object-cover"
            src={getFullS3Path(getLowestRankPicturePath(office.officePictures))}
          />
          <CardContent className="flex flex-col justify-center p-6">
            <h5 className="text-md w-full font-medium">{office.officeName}</h5>
            <div className="text-sm text-muted-foreground">
              <p>{`${office.officeAddress.street1}`}</p>
              <p>{`${office.officeAddress.city}, ${office.officeAddress.postalCode}`}</p>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card className={cn('border-none p-0 shadow-none', className)}>
        <CardHeader className="border-none bg-white p-0 pb-4">
          <CardTitle className="text-xl text-foreground">
            {t('reservation:side_details.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3">
            <ReservationTotalSection
              isLoading={isLoading}
              rentalPrice={rentalPrice}
              seats={data.seats}
              totalDays={totalDays}
              totalPrice={totalPrice}
            />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};
