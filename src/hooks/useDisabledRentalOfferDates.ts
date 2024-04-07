import { useCallback, useMemo } from 'react';

import type { OfficeRentalsType } from '../components/office-edit/sections/OfficeEditRentalsSection';
import { useOfficeRentalOffers } from '../queries/useOfficeRentalOffers';
import type { OfficeType } from '../types/Office';

export const useDisabledRentalOfferDates = (
  officeId: OfficeType['officeId'],
) => {
  const q_rentalOffers = useOfficeRentalOffers({ officeId: officeId });

  const disabledDates = useMemo(() => {
    const dates = q_rentalOffers.data?.map((offer) => ({
      from: offer.startDate,
      to: offer.endDate,
    }));

    return dates;
  }, [q_rentalOffers.data]);

  const handleDateRangeValidation = useCallback(
    (dateRange: OfficeRentalsType['dateRange']) => {
      if (!dateRange || !dateRange.to || !dateRange.from) {
        return false;
      }

      return (
        disabledDates?.some(
          (range) => dateRange.from <= range.to && dateRange.to >= range.from,
        ) ?? false
      );
    },
    [disabledDates],
  );

  return { disabledDates, handleDateRangeValidation };
};
