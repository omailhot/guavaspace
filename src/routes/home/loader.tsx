import { queryOptions } from '@tanstack/react-query';
import { array, parse } from 'valibot';

import { api } from '@/lib/api';
import { formatDateToQueryParams, getFullApiPath } from '@/lib/path';
import { RentalPreviewSchema } from '@/types/RentalPreviews';
import {
  GET_DEFAULT_FROM_DATE,
  GET_DEFAULT_ROOMS,
  GET_DEFAULT_SEATS,
  GET_DEFAULT_TO_DATE,
  SearchType,
} from '@/types/Search';

export const fetchRentalPreviews = async (search?: SearchType) => {
  const searchParams = new URLSearchParams();
  if (search?.location.lat && search?.location.lng) {
    searchParams.append('lng', String(search?.location.lng));
    searchParams.append('lat', String(search?.location.lat));
  }
  searchParams.append(
    'startDate',
    formatDateToQueryParams(search?.dateRange.from ?? GET_DEFAULT_FROM_DATE()),
  );
  searchParams.append(
    'endDate',
    formatDateToQueryParams(search?.dateRange.to ?? GET_DEFAULT_TO_DATE()),
  );
  searchParams.append(
    'seats',
    String(search?.capacity.seats ?? GET_DEFAULT_SEATS()),
  );
  searchParams.append(
    'rooms',
    String(search?.capacity.rooms ?? GET_DEFAULT_ROOMS()),
  );
  const rentals = await api.get(
    getFullApiPath('/rentals/previews', searchParams),
  );
  return parse(array(RentalPreviewSchema), rentals.data);
};

export const fetchRentalPreviewsQuery = (search?: SearchType) =>
  queryOptions({
    queryKey: ['rentalPreviews', search],
    queryFn: () => fetchRentalPreviews(search),
  });
