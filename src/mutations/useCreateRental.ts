import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api, handleAPIError } from '../lib/api';
import { getFullApiPath } from '../lib/path';

type CreateRentalParams = {
  officeId: string;
  startDate: string;
  endDate: string;
  seats: number;
};

export const handleCreateRental = async ({
  officeId,
  startDate,
  endDate,
  seats,
}: CreateRentalParams) => {
  const response = await api.post(getFullApiPath(`/offices/${officeId}/rentals`), {
    officeId,
    startDate,
    endDate,
    seats,
  });

  return response.data;
};

export const useCreateRental = () => {
  const { t } = useTranslation(['create-rental']);

  const mutation = useMutation({
    mutationFn: (params: CreateRentalParams) => handleCreateRental(params),
    onError: (error: any) => {
      const parsedError = handleAPIError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success(t('reservation:success'));
    },
  });

  return mutation;
};
