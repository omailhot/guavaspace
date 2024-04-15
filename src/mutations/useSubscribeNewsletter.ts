import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api, handleAPIError } from '../lib/api';
import { getFullApiPath } from '../lib/path';

type SubscribeNewsletterParams = {
  email: string;
};

export const handleSubscribeNewsletter = async ({
  email,
}: SubscribeNewsletterParams) => {
  const response = await api.post(getFullApiPath(`/newsletter`), { email });

  return response.data;
};

export const useSubscribeNewsletter = () => {
  const { t } = useTranslation(['newsletter']);

  const mutation = useMutation({
    mutationFn: (params: SubscribeNewsletterParams) =>
      handleSubscribeNewsletter(params),
    onError: (error: any) => {
      const parsedError = handleAPIError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success(t('footer:newsletter.success'));
    },
  });

  return mutation;
};
