import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';

import { handleCogintoError } from '../../../lib/cognito/Errors';
import { useSignIn } from '../../../mutations/useSignIn';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { SignInSchema, SignInType } from '../../../types/User';
import { PasswordInput } from '../../form/PasswordInput';
import { SubmitButton } from '../../form/SubmitButton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { StepAlert } from './StepAlert';
import { SwitchButton } from './SwitchButton';

export const SignInForm = () => {
  const { t } = useTranslation(['auth']);
  const signInMutation = useSignIn();
  const step = useAuthFlowStore((s) => s.step);

  const form = useForm<SignInType>({
    resolver: valibotResolver(SignInSchema),
    defaultValues: {
      email: 'olivier.mailhot2@gmail.com',
      password: 'Lol123456@',
    },
    disabled: signInMutation.isPending,
  });

  const isLoading = signInMutation.isPending;

  const error = signInMutation.error
    ? handleCogintoError(signInMutation.error)
    : null;

  return (
    <div className="flex flex-col divide-y-2">
      <Form {...form}>
        <form
          className="grid gap-4 pt-4"
          onSubmit={form.handleSubmit((values) =>
            signInMutation.mutate(values),
          )}
        >
          {step.alert ? <StepAlert {...step.alert} /> : null}
          {error ? <FormMessage>{t(error.messageKey)}</FormMessage> : null}
          <FormField
            control={form.control}
            name="email"
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.password.label')}</FormLabel>
                <FormControl>
                  <PasswordInput field={field} showCriteria={false} />
                </FormControl>
                <FormDescription>
                  <SwitchButton switchToStep="FORGOT_PASSWORD">
                    {t('auth:signin.forgot_password')}
                  </SwitchButton>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SwitchButton switchToStep="SIGN_UP">
            {t('auth:signup.switch_to_signin')}
          </SwitchButton>

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
};
