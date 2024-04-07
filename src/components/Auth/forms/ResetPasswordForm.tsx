import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';

import { handleCogintoError } from '../../../lib/cognito/Errors';
import { useResetPassword } from '../../../mutations/cognito/useResetPassword';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { ResetPasswordSchema, ResetPasswordType } from '../../../types/User';
import { SubmitButton } from '../../form/SubmitButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { StepAlert } from './StepAlert';

export const ResetPasswordForm = () => {
  const { t } = useTranslation(['auth']);
  const step = useAuthFlowStore((s) => s.step);
  const username = useAuthFlowStore((s) => s.username);

  const mutation = useResetPassword();

  const form = useForm<ResetPasswordType>({
    resolver: valibotResolver(ResetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordType) {
    if (!username) return;

    mutation.mutate({ username, ...values });
  }

  const isLoading = mutation.isPending;

  const error = mutation.error ? handleCogintoError(mutation.error) : null;

  return (
    <div className="flex flex-col divide-y-2">
      <Form {...form}>
        <form
          className="grid gap-4 pt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {step.alert ? <StepAlert {...step.alert} /> : null}
          {error ? <FormMessage>{t(error.messageKey)}</FormMessage> : null}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {t('auth:fields.reset_password_code.label')}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.new_password.label')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
};
