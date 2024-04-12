import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../../lib/cognito/Errors';
import { handleEmailConfirmation } from '../../lib/cognito/SignIn';
import { useAuthFlowStore } from '../../stores/useAuthFlowStore';

type Params = {
  username: string;
  code: string;
};

const _handleEmailConfirm = async (data: Params) => {
  await handleEmailConfirmation(data.username, data.code);
};

export const useEmailConfirmation = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: _handleEmailConfirm,
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
        firstLoginAfterSignup: true,
      });

      toast.success(t('auth:email_confirmation.success.title'), {
        description: t('auth:email_confirmation.success.description'),
      });
    },
  });

  return mutation;
};
