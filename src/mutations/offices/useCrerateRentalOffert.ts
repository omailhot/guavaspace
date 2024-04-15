import { useMutation } from '@tanstack/react-query';
import { format, isEqual } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { parse } from 'valibot';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { OfficeType, RentalOfferType } from '../../types/Office';
import { RentalOfferSchema } from '../../types/RentalOffert';
import { OfficeRentalsType } from './../../components/office-edit/sections/OfficeEditRentalsSection';

type DataType = {
  officeId: OfficeType['officeId'];
  officeRentalOffer: OfficeRentalsType;
};

const INFINITY_START_DATE = new Date('1900-01-01');
const INFINITY_END_DATE = new Date('2100-12-29');

export const areDatesEqual = (date1: Date, date2: Date) => {
  return isEqual(date1.setHours(0, 0, 0, 0), date2.setHours(0, 0, 0, 0));
};

export const isInfinityDate = (
  dateRange: Partial<Pick<RentalOfferType, 'startDate' | 'endDate'>>,
) => {
  if (!dateRange.startDate || !dateRange.endDate) {
    return false;
  }

  return (
    areDatesEqual(dateRange.startDate, INFINITY_START_DATE) &&
    areDatesEqual(dateRange.endDate, INFINITY_END_DATE)
  );
};

const handleCreateOffice = async (data: DataType) => {
  const response = await api.post(
    getFullApiPath(`/offices/${data.officeId}/rental-offers`),
    {
      startDate: format(
        data.officeRentalOffer.dateRange?.from ?? INFINITY_START_DATE,
        'yyyy-MM-dd',
      ),
      endDate: format(
        data.officeRentalOffer.dateRange?.to ?? INFINITY_END_DATE,
        'yyyy-MM-dd',
      ),
      dailyPricePerSeat: data.officeRentalOffer.dailyPrice,
      seatsAvailable: data.officeRentalOffer.seats,
      minDurationDays: data.officeRentalOffer.minDurationDays,
    },
  );

  return parse(RentalOfferSchema, response.data);
};

export const useCreateRentalOffer = () => {
  const { t } = useTranslation(['auth']);

  const mutation = useMutation({
    mutationKey: ['useCreateRentalOffert'],
    mutationFn: handleCreateOffice,
    onError: () => {
      toast.error(t('edit_office:edit_panel.rentals.messages.post.error'));
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.rentals.messages.post.success'));

      queryClient.invalidateQueries({
        queryKey: ['office-rental-offers'],
      });
    },
  });

  return mutation;
};
