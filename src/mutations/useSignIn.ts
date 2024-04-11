import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAuthContext } from '../contexts/AuthContext';
import { handleCogintoError } from '../lib/cognito/Errors';
import { handleSignin } from '../lib/cognito/SignIn';
import { useAuthFlowStore } from '../stores/useAuthFlowStore';

export const useSignIn = () => {
  const { setSession } = useAuthContext();
  const { t } = useTranslation(['auth']);
  const setStep = useAuthFlowStore((s) => s.setStep);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationFn: handleSignin,
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));

      if (parsedError.code === 'UserNotConfirmedException') {
        setStep('EMAIL_CONFIRMATION');
      }

      return parsedError;
    },
    onSuccess: (data) => {
      setSession(data);

      toast.success(t('auth:signin.success'));

      nextStep();
    },
  });

  return mutation;
};
