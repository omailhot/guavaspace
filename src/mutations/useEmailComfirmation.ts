import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../lib/cognito/Errors';
import { handleEmailConfirmation } from '../lib/cognito/SignIn';
import { useAuthFlowStore } from '../stores/useAuthFlowStore';

export const useEmailConfirmation = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async ({
      username,
      code,
    }: {
      username: string;
      code: string;
    }) => {
      return handleEmailConfirmation(username, code);
    },
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      nextStep({
        alert: {
          title: t('auth:email_confirmation.success.title'),
          description: t('auth:email_confirmation.success.description'),
        },
      });

      toast.success(t('auth:email_confirmation.success.title'), {
        description: t('auth:email_confirmation.success.description'),
      });
    },
  });

  return mutation;
};
