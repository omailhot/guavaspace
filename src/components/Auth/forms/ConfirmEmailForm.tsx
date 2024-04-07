import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Input } from '@/components/ui/input';

import { handleCogintoError } from '../../../lib/cognito/Errors';
import { useEmailConfirmation } from '../../../mutations/cognito/useEmailComfirmation';
import { useResendEmailConfirmation } from '../../../mutations/cognito/useResendEmailComfirmation';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { ConfirmEmailType, ConfirmnEmailSchema } from '../../../types/User';
import { SubmitButton } from '../../form/SubmitButton';
import { InlineLoader } from '../../loader/InlineLoader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { StepAlert } from './StepAlert';

export const ConfirmEmailForm = () => {
  const { t } = useTranslation(['auth']);
  const username = useAuthFlowStore((s) => s.username);
  const step = useAuthFlowStore((s) => s.step);

  const emailConfirmationMutation = useEmailConfirmation();
  const resendEmailConfirmationMutation = useResendEmailConfirmation();

  const form = useForm<ConfirmEmailType>({
    resolver: valibotResolver(ConfirmnEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  function onSubmit(values: ConfirmEmailType) {
    if (!username) return;

    emailConfirmationMutation.mutate({ username: username, code: values.code });
  }

  const confirmationIsLoading = emailConfirmationMutation.isPending;

  const emailConfirmationError = emailConfirmationMutation.error
    ? handleCogintoError(emailConfirmationMutation.error)
    : null;

  const handleResendCode = () => {
    if (!username) return;

    resendEmailConfirmationMutation.mutate({ username: username });
  };

  const resendError = resendEmailConfirmationMutation.error
    ? handleCogintoError(resendEmailConfirmationMutation.error)
    : null;

  const resendIsLoading = resendEmailConfirmationMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form
          className="grid gap-4 pt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {step.alert ? <StepAlert {...step.alert} /> : null}
          {emailConfirmationError ? (
            <FormMessage>{t(emailConfirmationError.messageKey)}</FormMessage>
          ) : null}
          {resendError ? (
            <FormMessage>{t(resendError.messageKey)}</FormMessage>
          ) : null}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {t('auth:fields.email_confirmation_code.label')}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={confirmationIsLoading}
          />
        </form>
      </Form>
      <div className="flex items-center gap-1 text-primary">
        <button
          className={twMerge('text-sm', !resendIsLoading && 'hover:underline')}
          disabled={resendIsLoading}
          onClick={handleResendCode}
          type="button"
        >
          {t('auth:email_confirmation.resend_code')}
        </button>
        {resendIsLoading ? <InlineLoader /> : null}
      </div>
    </div>
  );
};
