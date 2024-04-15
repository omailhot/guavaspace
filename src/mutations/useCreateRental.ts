import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { EmailType } from '@/components/auth/AuthModal';

import { api, handleAPIError } from '../lib/api';
import { getFullApiPath } from '../lib/path';

type CreateRentalParams = {
  officeId: string;
  startDate: string;
  endDate: string;
  seats: number;
  email: EmailType;
};

export const handleCreateRental = async ({
  officeId,
  startDate,
  endDate,
  seats,
  email
}: CreateRentalParams) => {
  const response = await api
    .post(getFullApiPath(`/offices/${officeId}/rentals`), {
      officeId,
      startDate,
      endDate,
      seats,
    })
    .then(await api.post(getFullApiPath(`/confirmation-email/${email}`)));

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
