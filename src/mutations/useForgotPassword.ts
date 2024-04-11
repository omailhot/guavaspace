import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../lib/cognito/Errors';
import { handleForgotPassword } from '../lib/cognito/ForgotPassword';
import { useAuthFlowStore } from '../stores/useAuthFlowStore';

export const useForgotPassword = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);
  const setUsername = useAuthFlowStore((s) => s.setUsername);

  const mutation = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async ({ username }: { username: string }) =>
      handleForgotPassword(username),
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: (_, variables) => {
      setUsername(variables.username);

      nextStep();
    },
  });

  return mutation;
};
