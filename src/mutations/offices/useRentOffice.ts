import { useMutation } from '@tanstack/react-query';
import { parse } from 'valibot';

import {
  OfficeDetailsSearchParamsSchemaWithDefaults,
  OfficeDetailsSearchParamsType,
} from '../../routes/offices/details';
import { OfficeType } from '../../types/Office';

type Params = {
  officeId: OfficeType['officeId'];
  searchParams: OfficeDetailsSearchParamsType;
};

export const handleRentOffice = async ({ searchParams }: Params) => {
  const queryUrl = new URLSearchParams();

  const searchWithDefaults = parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    searchParams,
  );

  queryUrl.append('from', searchWithDefaults.from.toISOString());
  queryUrl.append('to', searchWithDefaults.to.toISOString());
  queryUrl.append('seats', searchWithDefaults.seats.toString());
  queryUrl.append('rooms', searchWithDefaults.rooms.toString());

  return {
    ok: true,
  };
};

export const useRentOffice = () => {
  const mutation = useMutation({
    mutationFn: (params: Params) => handleRentOffice(params),
    onError: (error: any) => {
      console.error(error);
    },
  });

  return mutation;
};
