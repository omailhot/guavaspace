import { queryOptions } from '@tanstack/react-query';
import { array, parse } from 'valibot';

import { api } from '@/lib/api';
import { getFullApiPath } from '@/lib/path';
import { OfficeSchema } from '@/types/Office';

type GetCompanyOfficesType = {
  companyId: string;
};

export const fetchCompanyOffices = async ({
  companyId,
}: GetCompanyOfficesType) => {
  const profile = await api.get(
    getFullApiPath(`/companies/${companyId}/offices`),
  );
  return parse(array(OfficeSchema), profile.data);
};

export const fetchCompanyOfficesQuery = ({
  companyId,
}: GetCompanyOfficesType) =>
  queryOptions({
    queryKey: ['company-offices', companyId],
    queryFn: () => fetchCompanyOffices({ companyId }),
  });
