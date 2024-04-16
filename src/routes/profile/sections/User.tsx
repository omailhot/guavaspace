import { valibotResolver } from '@hookform/resolvers/valibot';
import { createRoute } from '@tanstack/react-router';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { format, parse } from 'date-fns';
import { CalendarIcon, Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import {
  coerce,
  date,
  object,
  Output,
  parse as v_parse,
  string,
} from 'valibot';

import { SubmitButton } from '../../../components/form/SubmitButton';
import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { getInputClasses, Input } from '../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { useLocale } from '../../../hooks/useLocale';
import { POOL_DATA } from '../../../lib/cognito/UserPool';
import { cn } from '../../../lib/utils';
import { useForgotPassword } from '../../../mutations/cognito/useForgotPassword';
import { useModifyUser } from '../../../mutations/useModifyUser';
import { ProfileRoute } from '..';

export const ProfileUserFormSchema = object({
  birthdate: date(),
  family_name: string(),
  given_name: string(),
  phone_number: string(),
});
export type ProfileUserFormType = Output<typeof ProfileUserFormSchema>;

const Component = () => {
  const { t } = useTranslation('profile');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const locale = useLocale();

  const m_forgotPassword = useForgotPassword();

  const user = ProfileUserRoute.useLoaderData() as ProfileUserLoaderType;

  const m_modifyUser = useModifyUser();

  const form = useForm<ProfileUserFormType>({
    resolver: valibotResolver(ProfileUserFormSchema),
    defaultValues: {
      ...user,
    },
  });

  const handleSubmit = (data: ProfileUserFormType) => {
    m_modifyUser.mutate(data);
  };

  const handleChangePassword = () => {
    m_forgotPassword.mutate({ username: user.email });
  };

  const loading = m_modifyUser.isPending;

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex h-full w-full flex-col lg:ml-0 lg:w-2/3">
        <CardContent className="p-0">
          <CardHeader className="border-b">
            <CardTitle>{t('profile:user.title')}</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-4">
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>{t('auth:fields.email.label')}</FormLabel>
                    <Input disabled value={user.email} />
                  </FormItem>
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>{t('auth:fields.password.label')}</FormLabel>
                    <div className="flex gap-3">
                      <Input
                        disabled
                        type="password"
                        value="thisisafakepassword"
                      />
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleChangePassword();
                        }}
                        variant="ghost"
                      >
                        <Settings className="mr-1.5 h-5 w-5" />
                        {t('auth:fields.password.change')}
                      </Button>
                    </div>
                  </FormItem>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>
                          {t('auth:fields.given_name.label')}
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
                    name="family_name"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>
                          {t('auth:fields.family_name.label')}
                        </FormLabel>
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
                                <span>
                                  {t('auth:fields.birthdate.placeholder')}
                                </span>
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
                      <FormLabel>
                        {t('auth:fields.phone_number.label')}
                      </FormLabel>
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
                <SubmitButton
                  className="mt-1.5"
                  disabled={!form.formState.isValid}
                  isLoading={loading}
                />
              </form>
            </Form>
          </CardBody>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProfileUserLoaderSchema = object({
  birthdate: coerce(date(), (value: any) =>
    parse(value, 'MM/dd/yyyy', new Date()),
  ),
  family_name: string(),
  given_name: string(),
  phone_number: string(),
  email: string(),
});
export type ProfileUserLoaderType = Output<typeof ProfileUserLoaderSchema>;

export const ProfileUserRoute = createRoute({
  getParentRoute: () => ProfileRoute,
  component: Component,
  path: '/',
  beforeLoad: ({ context }) => {
    context.auth.ensureConnected();
  },
  loader: async () => {
    const userPool = new CognitoUserPool(POOL_DATA);
    const user = userPool.getCurrentUser();

    if (!user) {
      return;
    }

    return await new Promise((resolve, reject) => {
      user.getSession((err: Error | null) => {
        if (err) {
          return reject(err);
        }

        user.getUserAttributes((err, attributes) => {
          if (err) {
            return reject(err);
          }

          const data = attributes?.reduce((acc, attr) => {
            const { Name, Value } = attr;

            acc[Name] = Value;

            return acc;
          }, {} as any);

          resolve(v_parse(ProfileUserLoaderSchema, data));
        });
      });
    });
  },
});
