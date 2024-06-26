import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api } from '../../lib/api';
import { handleCogintoError } from '../../lib/cognito/Errors';
import { handleSignin } from '../../lib/cognito/SignIn';
import { getFullApiPath } from '../../lib/path';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAuthFlowStore } from '../../stores/useAuthFlowStore';
import { SignInType } from '../../types/User';

type Params = SignInType & {
  isFirstLogin: boolean;
};

export const useSignIn = () => {
  const { setSession } = useAuthContext();
  const { t } = useTranslation(['auth']);
  const setStep = useAuthFlowStore((s) => s.setStep);
  const nextStep = useAuthFlowStore((s) => s.nextStep);

  const mutation = useMutation({
    mutationFn: async (values: Params) => {
      const response = await handleSignin(values);

      await setSession(response);

      if (values.isFirstLogin) {
        await api.post(getFullApiPath('/customer-profile'));
      }

      return { response, isFirstLogin: values.isFirstLogin };
    },
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));

      if (parsedError.code === 'UserNotConfirmedException') {
        setStep('EMAIL_CONFIRMATION');
      }

      return parsedError;
    },
    onSuccess: async () => {
      toast.success(t('auth:signin.success'));

      nextStep();
    },
  });

  return mutation;
};
