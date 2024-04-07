import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../../lib/cognito/Errors';
import { handleResetPassword } from '../../lib/cognito/ResetPassword';
import { useAuthFlowStore } from '../../stores/useAuthFlowStore';

export const useResetPassword = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async ({
      username,
      code,
      newPassword,
    }: {
      username: string;
      code: string;
      newPassword: string;
    }) => handleResetPassword(username, code, newPassword),
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      nextStep({
        alert: {
          title: t('auth:reset_password.success.title'),
          description: t('auth:reset_password.success.description'),
        },
      });
    },
  });

  return mutation;
};
