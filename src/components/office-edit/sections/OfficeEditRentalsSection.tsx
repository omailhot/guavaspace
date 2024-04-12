import { valibotResolver } from '@hookform/resolvers/valibot';
import { format } from 'date-fns';
import { CalendarClock, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { coerce, date, nullish, object, type Output } from 'valibot';

import { useDisabledRentalOfferDates } from '../../../hooks/useDisabledRentalOfferDates';
import { useLocale } from '../../../hooks/useLocale';
import { formatErrorKey, generateRandomNumber } from '../../../lib/utils';
import {
  isInfinityDate,
  useCreateRentalOffer,
} from '../../../mutations/offices/useCrerateRentalOffert';
import { useDeleteRentalOffer } from '../../../mutations/offices/useDeleteAmenity';
import { useOfficeRentalOffers } from '../../../queries/useOfficeRentalOffers';
import { OfficeEditRentalOffersRoute } from '../../../routes/offices/edit/rental-offers';
import { RentalOfferSchema, type RentalOfferType } from '../../../types/Office';
import { PopoverCapacityInput } from '../../form/PopoverCalendarInput';
import { SubmitButton } from '../../form/SubmitButton';
import { Button } from '../../ui/button';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Skeleton } from '../../ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

export const OfficeRentalsSchema = object({
  dateRange: nullish(
    object({
      from: date(),
      to: date(),
    }),
  ),
  dailyPrice: coerce(RentalOfferSchema.entries.dailyPricePerSeat, (i) =>
    Number(i),
  ),
  seats: coerce(RentalOfferSchema.entries.seatsAvailable, (i) => Number(i)),
  minDurationDays: coerce(RentalOfferSchema.entries.minDurationDays, (i) =>
    Number(i),
  ),
});
export type OfficeRentalsType = Output<typeof OfficeRentalsSchema>;

export const OfficeEditRentalsSection = () => {
  const { t } = useTranslation(['edit_office', 'office', 'rental']);

  const officeId = OfficeEditRentalOffersRoute.useParams().id;
  const m_createRentalOffer = useCreateRentalOffer();
  const m_deleteRentalOffer = useDeleteRentalOffer();
  const q_rentalOffers = useOfficeRentalOffers({ officeId: officeId });

  const { disabledDates, handleDateRangeValidation } =
    useDisabledRentalOfferDates(officeId);

  const locale = useLocale();

  const form = useForm<OfficeRentalsType>({
    resolver: valibotResolver(OfficeRentalsSchema),
    defaultValues: {
      dailyPrice: 100,
      seats: 1,
      minDurationDays: 1,
    },
    mode: 'all',
    criteriaMode: 'all',
  });

  function onSubmit(values: OfficeRentalsType) {
    const intersection = handleDateRangeValidation(form.getValues('dateRange'));

    if (intersection) {
      form.setError('dateRange', {
        type: 'object',
        message: formatErrorKey('rental:fields.date_range.erros.intersection'),
      });

      return;
    }

    m_createRentalOffer
      .mutateAsync({
        officeId: officeId,
        officeRentalOffer: values,
      })
      .then(() => {
        form.reset();
      })
      .catch(() => {
        m_createRentalOffer.reset();
      });
  }

  const handleOfficeRentalOfferDelete = (offer: RentalOfferType) => {
    m_deleteRentalOffer.mutateAsync({
      officeId: officeId,
      rentalOfferId: offer.rentalOfferId,
    });
  };

  const isLoading =
    m_createRentalOffer.isPending || m_deleteRentalOffer.isPending;
  const isError =
    m_createRentalOffer.isError ||
    m_deleteRentalOffer.isError ||
    !form.formState.isValid;

  const parseDate = (
    offer: Partial<Pick<RentalOfferType, 'startDate' | 'endDate'>>,
  ) => {
    if (!offer.startDate || !offer.endDate)
      return t('rental:fields.date_range.infinity');

    const range = `${format(offer.startDate, 'LLL dd, y', {
      locale,
    })} - ${format(offer.endDate, 'LLL dd, y', { locale })}`;
    const infinityDate = isInfinityDate(offer);

    return infinityDate ? t('rental:fields.date_range.infinity') : range;
  };

  const dateRange = form.watch('dateRange');

  return (
    <div className="flex flex-col items-start gap-5 lg:ml-0 lg:mr-5 lg:flex-row">
      <Card className="h-auto w-full lg:w-1/3">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <CardHeader>
                <CardTitle>
                  {t('edit_office:edit_panel.rentals.title')}
                </CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col gap-5 pb-5">
                <FormField
                  control={form.control}
                  name="dailyPrice"
                  render={({ field }) => (
                    <FormItem className="grid w-full items-center gap-1.5">
                      <FormLabel>
                        {t('rental:fields.daily_price.label')}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage errorNamespaces={['rental']} />
                    </FormItem>
                  )}
                />
                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem className="grid w-full items-center gap-1.5">
                        <FormLabel>{t('rental:fields.seats.label')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage errorNamespaces={['rental']} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minDurationDays"
                    render={({ field }) => (
                      <FormItem className="grid w-full items-center gap-1.5">
                        <FormLabel>
                          {t('rental:fields.min_duration_days.label')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage errorNamespaces={['rental']} />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dateRange"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref: _, ...fieldProps } }) => (
                    <FormItem className="grid w-full items-center gap-1.5">
                      <FormLabel>
                        {t('rental:fields.date_range.label')}
                      </FormLabel>
                      <FormControl>
                        <PopoverCapacityInput
                          {...fieldProps}
                          disabledDates={disabledDates}
                          numberOfMonths={1}
                        >
                          <CalendarClock className="pr-2" />
                          {t('rental:fields.date_range.label')}
                          {' : '}
                          {parseDate({
                            startDate: dateRange?.from,
                            endDate: dateRange?.to,
                          })}
                        </PopoverCapacityInput>
                      </FormControl>
                      <FormMessage errorNamespaces={['rental']} />
                    </FormItem>
                  )}
                  rules={{
                    onBlur: handleDateRangeValidation,
                  }}
                />
                <SubmitButton disabled={isError} isLoading={isLoading} />
              </CardBody>
            </CardContent>
          </form>
        </Form>
      </Card>
      <Card className="max-w-[100vw] flex-1 overflow-x-auto lg:max-w-none">
        <Table isLoading={isLoading}>
          <TableCaption className="pb-5">
            {t('edit_office:edit_panel.features.table.caption')}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('rental:fields.date_range.label')}</TableHead>
              <TableHead>{t('rental:fields.daily_price.label')}</TableHead>
              <TableHead>{t('rental:fields.seats.label')}</TableHead>
              <TableHead>
                {t('rental:fields.min_duration_days.label')}
              </TableHead>
              <TableHead>
                {t(
                  'edit_office:edit_panel.features.table.columns.change_order',
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {q_rentalOffers.data ? (
              !q_rentalOffers.data.length ? (
                <TableRow>
                  <TableCell className="text-center" colSpan={5}>
                    {t('rental:no_results')}
                  </TableCell>
                </TableRow>
              ) : (
                q_rentalOffers.data.map((offer) => {
                  return (
                    <TableRow key={offer.rentalOfferId}>
                      <TableCell className="font-medium">
                        {parseDate(offer)}
                      </TableCell>
                      <TableCell>{offer.dailyPricePerSeat}</TableCell>
                      <TableCell>{offer.seatsAvailable}</TableCell>
                      <TableCell>{offer.minDurationDays}</TableCell>
                      <TableCell>
                        <div>
                          <Button
                            className="hover:text-red-600"
                            disabled={isLoading}
                            onClick={() => handleOfficeRentalOfferDelete(offer)}
                            variant="ghost"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )
            ) : (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow
                  key={`table-row-skeleton-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableCell
                      key={`table-cell-skeleton-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                    >
                      <Skeleton
                        className="h-[1em]"
                        style={{
                          width: `${generateRandomNumber(36, 96)}px`,
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
