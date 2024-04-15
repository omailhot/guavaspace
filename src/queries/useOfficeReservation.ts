import { useQuery } from '@tanstack/react-query';

import { OfficeDetailsSearchParamsType } from '../routes/offices/details';
import { OfficeType } from '../types/Office';

type Params = {
  officeId: OfficeType['officeId'];
  searchParams: OfficeDetailsSearchParamsType;
};

export const handleOfficeReservation = async ({
  searchParams,
}: Params) => {
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
