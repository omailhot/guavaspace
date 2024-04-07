import { differenceInDays } from 'date-fns';
import { SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parse } from 'valibot';

import { useOfficeContext } from '../../../Contexts/OfficeContext';
import { useFormatCurrency } from '../../../hooks/useFormatCurrency';
import { useLocale } from '../../../hooks/useLocale';
import { useRentOffice } from '../../../mutations/offices/useRentOffice';
import { useOfficeRentalPreview } from '../../../queries/useOfficeRentalPreview';
import { OfficeDetailsSearchParamsSchemaWithDefaults } from '../../../routes/offices/details';
import { CapacityInput } from '../../form/CapacityInput';
import { SubmitButton } from '../../form/SubmitButton';
import { SmartSkeleton } from '../../SmartSkeleton';
import { Button } from '../../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../ui/drawer';
import { getOfficeRoute } from '../OfficeDetails';
import {
  formatDateInput,
  OfficeDetailsCalendarInput,
} from '../OfficeDetailsCalendarInput';
import { RentPanelTotalSection } from './sections/RentPanelTotalSection';

export const RentPanelMobile = () => {
  const { isEdit } = useOfficeContext();
  const route = getOfficeRoute(isEdit);
  const { t } = useTranslation(['office']);
  const params = route.useParams();
  const locale = useLocale();
  const { formatCurrency } = useFormatCurrency();

  const mutation = useRentOffice();

  const seachParams = route.useSearch();

  const searchWithDefaults = parse(
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
    <div className="lg:hidden">
      <div className="mb-10" />
      <div className="fixed bottom-0 flex h-20 w-screen items-center justify-between border-t-2 border-gray-200 bg-white px-10">
        <div className="flex flex-col leading-none">
          <SmartSkeleton className="h-[1rem] min-w-32" isLoading={isLoading}>
            <span className="font-bold">
              {formatCurrency(avgDailyPricePerSeat ?? 0)}
            </span>{' '}
            {t('office:rent_panel.per_day')}
          </SmartSkeleton>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  className="h-auto p-0"
                  disabled={isLoading}
                  variant="link"
                >
                  <SlidersHorizontal className="mr-1" size={14} />
                  {formatDateInput(
                    searchWithDefaults.from,
                    searchWithDefaults.to,
                    locale,
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t('office:rent_panel.title')}</DrawerTitle>
                </DrawerHeader>
                <div className="m-3 flex flex-col gap-3">
                  <OfficeDetailsCalendarInput
                    disabled={isLoading}
                    numberOfMonths={1}
                  />
                  <CapacityInput disabled={isLoading} />
                  {shouldRenderCostSection ? (
                    <RentPanelTotalSection
                      isLoading={isLoading}
                      rentalPrice={avgDailyPricePerSeat}
                      totalDays={totalDays}
                      totalPrice={totalPrice}
                    />
                  ) : null}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">
                      {t('translation:buttons.close')}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="ml-auto">{_submitButton}</div>
      </div>
    </div>
  );
};
