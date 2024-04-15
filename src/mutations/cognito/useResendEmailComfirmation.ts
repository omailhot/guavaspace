import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleCogintoError } from '../../lib/cognito/Errors';
import { handleResendConfirmationCode } from '../../lib/cognito/SignIn';

export const useResendEmailConfirmation = () => {
  const { t } = useTranslation(['auth']);

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async ({ username }: { username: string }) =>
      handleResendConfirmationCode(username),
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success('Email confirmation code resent!');
    },
  });

  return mutation;
};
