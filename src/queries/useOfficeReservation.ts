import { useQuery } from '@tanstack/react-query';

import { getFullApiPath } from '../lib/path';
import { OfficeDetailsSearchParamsType } from '../routes/offices/details';
import { OfficeType } from '../types/Office';

type Params = {
  officeId: OfficeType['officeId'];
  searchParams: OfficeDetailsSearchParamsType;
};

export const handleOfficeReservation = async ({
  officeId,
  searchParams,
}: Params) => {
  const queryUrl = new URLSearchParams();

  console.log({
    url: getFullApiPath(`/offices/${officeId}/reservation`, queryUrl),
  });

  return {
    availableSeats: searchParams.seats === 10 ? 0 : 25,
    rentalPrice: 100,
  };
};

export const useOfficeReservation = (params: Params) => {
  const mutation = useQuery({
    queryKey: ['officeReservation', params],
    queryFn: ({ queryKey }) => handleOfficeReservation(queryKey[1] as Params),
  });

  return mutation;
};
