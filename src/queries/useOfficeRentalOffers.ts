import { useQuery } from '@tanstack/react-query';
import { array, parse } from 'valibot';

import { api } from '../lib/api';
import { getFullApiPath } from '../lib/path';
import { OfficeType, RentalOfferSchema } from '../types/Office';

type Params = {
  officeId: OfficeType['officeId'];
};

export const handleOfficeRentalOffers = async (data: Params) => {
  const response = await api.get(
    getFullApiPath(`/offices/${data.officeId}/rental-offers`),
  );

  const offers = parse(array(RentalOfferSchema), response.data).sort((a, b) => {
    if (a.startDate > b.startDate) {
      return 1;
    }
    if (a.startDate < b.startDate) {
      return -1;
    }
    return 0;
  });

  return offers;
};

export const useOfficeRentalOffers = ({ officeId }: Params) => {
  const mutation = useQuery({
    queryKey: ['office-rental-offers', officeId],
    queryFn: () => handleOfficeRentalOffers({ officeId }),
  });

  return mutation;
};
