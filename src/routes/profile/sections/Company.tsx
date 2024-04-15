import { valibotResolver } from '@hookform/resolvers/valibot';
import { createRoute, redirect } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { object, Output, string } from 'valibot';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';
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
import { Input } from '../../../components/ui/input';
import { useAuthContext } from '../../../contexts/AuthContext';
import { getFullS3Path } from '../../../lib/path';
import { ProfileRoute } from '..';
import { ProfileUserRoute } from './User';

export const ProfileUserFormSchema = object({
  companyName: string(),
});
export type ProfileUserFormType = Output<typeof ProfileUserFormSchema>;

const Component = () => {
  const { t } = useTranslation('profile');

  const { managerProfile } = useAuthContext();

  if (!managerProfile) {
    throw redirect({
      to: ProfileUserRoute.fullPath,
    });
  }

  const form = useForm<ProfileUserFormType>({
    resolver: valibotResolver(ProfileUserFormSchema),
    defaultValues: {
      companyName: managerProfile.company.companyName,
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex h-full w-full flex-col lg:ml-0 lg:w-2/3">
        <CardContent className="p-0">
          <CardHeader className="border-b">
            <CardTitle>{t('profile:company.title')}</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-4">
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {t('profile:company.disabled_message.title')}
              </AlertTitle>
              <AlertDescription>
                {t('profile:company.disabled_message.message')}
              </AlertDescription>
            </Alert>
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit(console.log)}
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t('auth:fields.company_name.label')}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex flex-col">
                  <FormLabel>{t('auth:fields.company_name.image')}</FormLabel>
                  <img
                    className="w-48 rounded-md"
                    src={getFullS3Path(managerProfile.company.companyLogoPath)}
                  />
                </FormItem>
              </form>
            </Form>
          </CardBody>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProfileCompanyRoute = createRoute({
  getParentRoute: () => ProfileRoute,
  component: Component,
  path: '/company',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});
