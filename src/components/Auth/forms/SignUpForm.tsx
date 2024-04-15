import { valibotResolver } from '@hookform/resolvers/valibot';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { getInputClasses, Input } from '@/components/ui/input';

import { useLocale } from '../../../hooks/useLocale';
import { handleCogintoError } from '../../../lib/cognito/Errors';
import { cn } from '../../../lib/utils';
import { useSignUp } from '../../../mutations/cognito/useSignUp';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { UserSchema, UserType } from '../../../types/User';
import { PasswordInput } from '../../form/PasswordInput';
import { SubmitButton } from '../../form/SubmitButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { StepAlert } from './StepAlert';
import { SwitchButton } from './SwitchButton';

export const SignUpForm = () => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const step = useAuthFlowStore((s) => s.step);

  const { t } = useTranslation(['auth']);
  const mutation = useSignUp();

  const locale = useLocale();

  const form = useForm<UserType>({
    resolver: valibotResolver(UserSchema),
    defaultValues: {
      email: 'opaxxgaming@gmail.com',
      password: 'Lol123456@',
      family_name: 'Deschenes',
      given_name: 'Olivier',
      birthdate: new Date('1995-01-01'),
      phone_number: '+15142688748',
    },
  });

  const isLoading = mutation.isPending;

  const error = mutation.error ? handleCogintoError(mutation.error) : null;

  return (
    <div className="flex flex-col divide-y-2">
      <Form {...form}>
        <form
          className="grid gap-4 pt-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {step.alert ? <StepAlert {...step.alert} /> : null}
          {error ? <FormMessage>{t(error.messageKey)}</FormMessage> : null}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="given_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('auth:fields.given_name.label')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="family_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('auth:fields.family_name.label')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.birthdate.label')}</FormLabel>
                <Popover
                  onOpenChange={(open) => setDatePickerOpen(open)}
                  open={datePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                        variant="outline"
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale })
                        ) : (
                          <span>{t('auth:fields.birthdate.placeholder')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      locale={locale}
                      mode="single"
                      onSelect={(date) => {
                        field.onChange(date);

                        setDatePickerOpen(false);
                      }}
                      selected={new Date(field.value)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.phone_number.label')}</FormLabel>
                <FormControl>
                  <PhoneInputWithCountry
                    className={getInputClasses('py-0 pr-0')}
                    defaultCountry="CA"
                    international={false}
                    numberInputProps={{
                      className: 'px-3 h-full',
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <PasswordInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SwitchButton switchToStep="SIGN_IN">
            {t('auth:signin.switch_to_signup')}
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
