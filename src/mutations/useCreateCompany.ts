import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../lib/cognito/Errors';
import { useAuthFlowStore } from '../stores/useAuthFlowStore';

export const useCreateCompany = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async ({ companyName }: { companyName: string }) => {
      return {
        sucess: true,
        company: {
          companyName,
        },
      };
    },
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      nextStep();

      toast.success(t('auth:email_confirmation.success.title'), {
        description: t('auth:email_confirmation.success.description'),
      });
    },
  });

  return mutation;
};
