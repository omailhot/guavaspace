import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';

import { handleCogintoError } from '../../../lib/cognito/Errors';
import { useForgotPassword } from '../../../mutations/cognito/useForgotPassword';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { ForgotPasswordSchema, ForgotPasswordType } from '../../../types/User';
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

export const ForgotPasswordForm = () => {
  const { t } = useTranslation(['auth']);
  const step = useAuthFlowStore((s) => s.step);

  const mutation = useForgotPassword();

  const form = useForm<ForgotPasswordType>({
    resolver: valibotResolver(ForgotPasswordSchema),
    defaultValues: {
      username: 'deso1301@usherbrooke.ca',
    },
  });

  async function onSubmit(values: ForgotPasswordType) {
    mutation.mutate({ username: values.username });
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
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.email.label')}</FormLabel>
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
