import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../../lib/cognito/Errors';
import { handleSignup } from '../../lib/cognito/SignUp';
import { useAuthFlowStore } from '../../stores/useAuthFlowStore';

export const useSignUp = () => {
  const { t } = useTranslation(['auth']);
  const nextStep = useAuthFlowStore((s) => s.nextStep);
  const setUsername = useAuthFlowStore((s) => s.setUsername);

  const mutation = useMutation({
    mutationFn: handleSignup,
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: (data) => {
      setUsername(data.user.getUsername());

      nextStep({ needsToConfirmEmail: !data.userConfirmed });

      toast.success(t('auth:signup.success'));
    },
  });

  return mutation;
};
