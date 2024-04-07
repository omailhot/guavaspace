import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { coerce, date, number, object, Output, parse } from 'valibot';

import { api } from '../lib/api';
import { getFullApiPath } from '../lib/path';
import {
  OfficeDetailsSearchParamsSchemaWithDefaults,
  OfficeDetailsSearchParamsType,
} from '../routes/offices/details';
import { OfficeSchema, OfficeType } from '../types/Office';

type Params = {
  officeId: OfficeType['officeId'];
  searchParams: OfficeDetailsSearchParamsType;
};

export const OfficeRentalPreviewSchema = object({
  startDate: coerce(date(), (value: any) => new Date(value)),
  endDate: coerce(date(), (value: any) => new Date(value)),
  office: OfficeSchema,
  avgDailyPricePerSeat: number(),
  seatsAvailable: number(),
});
export type OfficeRentalPreviewType = Output<typeof OfficeRentalPreviewSchema>;

export const handleOfficeRentalPreview = async ({
  searchParams,
  officeId,
}: Params) => {
  const queryUrl = new URLSearchParams();

  const searchWithDefaults = parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    searchParams,
  );

  queryUrl.append('startDate', format(searchWithDefaults.from, 'yyyy-MM-dd'));
  queryUrl.append('endDate', format(searchWithDefaults.to, 'yyyy-MM-dd'));
  queryUrl.append('seats', searchWithDefaults.seats.toString());
  queryUrl.append('rooms', searchWithDefaults.rooms.toString());

  const response = await api.get(
    getFullApiPath(`/offices/${officeId}/rentals/previews`, queryUrl),
  );

  if (response.data === null) {
    return null;
  }

  return parse(OfficeRentalPreviewSchema, response.data);
};

export const useOfficeRentalPreview = (params: Params) => {
  const mutation = useQuery({
    queryKey: ['officeRentalPreview', params],
    queryFn: ({ queryKey }) => handleOfficeRentalPreview(queryKey[1] as Params),
    retry: false,
  });

  return mutation;
};
