import { queryOptions } from '@tanstack/react-query';
import { array, parse } from 'valibot';

import { api } from '@/lib/api';
import { getFullApiPath } from '@/lib/path';
import { RentalsSchema } from '@/types/Rentals';

export const fetchRentals = async () => {
  const rentals = await api.get(getFullApiPath('/rentals'));
  return parse(array(RentalsSchema), rentals.data);
};

export const fetchRentalsQuery = () =>
  queryOptions({
    queryKey: ['rentals'],
    queryFn: () => fetchRentals(),
  });
