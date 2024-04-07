import { differenceInDays } from 'date-fns';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';

import { cn } from '@/lib/utils';

import { useOfficeContext } from '../../../Contexts/OfficeContext';
import { useRentOffice } from '../../../mutations/offices/useRentOffice';
import { useOfficeRentalPreview } from '../../../queries/useOfficeRentalPreview';
import { OfficeDetailsSearchParamsSchemaWithDefaults } from '../../../routes/offices/details';
import { CapacityInput } from '../../form/CapacityInput';
import { SubmitButton } from '../../form/SubmitButton';
import { Button } from '../../ui/button';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { getOfficeRoute } from '../OfficeDetails';
import { OfficeDetailsCalendarInput } from '../OfficeDetailsCalendarInput';
import { RentPanelTotalSection } from './sections/RentPanelTotalSection';

const DataPickerSchema = v.object({});

export type DataPickerType = v.Output<typeof DataPickerSchema>;

export const RentPanelDesktop = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isEdit } = useOfficeContext();
  const route = getOfficeRoute(isEdit);
  const { t } = useTranslation(['office']);
  const params = route.useParams();

  const mutation = useRentOffice();

  const seachParams = route.useSearch();

  const searchWithDefaults = v.parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    seachParams,
  );

  const query = useOfficeRentalPreview({
    officeId: params.id,
    searchParams: searchWithDefaults,
  });

  const totalDays = searchWithDefaults.to
    ? differenceInDays(searchWithDefaults.to, searchWithDefaults.from)
    : 1;

  const isLoading = mutation.isPending || query.isPending;

  const seats = query.data?.seatsAvailable || 0;
  const avgDailyPricePerSeat = query.data?.avgDailyPricePerSeat;

  const hasEnoughtSeats = seats >= searchWithDefaults.seats;

  const totalPrice = totalDays * (avgDailyPricePerSeat || 0);

  const shouldRenderCostSection = seats !== 0 && hasEnoughtSeats;

  const _submitButton = useMemo(() => {
    if (seats === 0 && !isLoading) {
      return (
        <Button disabled variant="destructive">
          {t('office:rent_panel.no_seats_available')}
        </Button>
      );
    }

    if (!hasEnoughtSeats && !isLoading) {
      return (
        <Button disabled variant="secondary">
          {t('office:rent_panel.not_enough_seats', { count: seats })}
        </Button>
      );
    }

    return (
      <SubmitButton isLoading={isLoading}>
        {t('office:rent_panel.book_now')}
      </SubmitButton>
    );
  }, [hasEnoughtSeats, isLoading, seats, t]);

  if (query.isError) {
    return <div>{query.error.message}</div>;
  }

  return (
    <Card className={cn('hidden lg:block', className)}>
      <CardHeader>
        <CardTitle>{t('office:rent_panel.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardBody className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <OfficeDetailsCalendarInput disabled={isLoading} />
            <CapacityInput disabled={isLoading} />
            {_submitButton}
          </div>
          {shouldRenderCostSection ? (
            <RentPanelTotalSection
              isLoading={isLoading}
              rentalPrice={avgDailyPricePerSeat}
              totalDays={totalDays}
              totalPrice={totalPrice}
            />
          ) : null}
        </CardBody>
      </CardContent>
    </Card>
  );
};
