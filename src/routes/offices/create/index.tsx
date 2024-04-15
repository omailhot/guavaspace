import { createRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as v from 'valibot';

import { MobileNavigation } from '@/components/header/Navigation/MobileNavigation';
import { MainLayout } from '@/layouts/MainLayout';
import { IndexRoute } from '@/routes/home';
import { SearchSchema } from '@/types/Search';

import { PageLoader } from '../../../components/loader/PageLoader';
import { OfficeDescriptionType } from '../../../components/office-edit/sections/OfficeEditDescriptionForm';
import {
  CreateOfficeType,
  useCreateOffice,
} from '../../../mutations/offices/useCreateOffice';
import { BaseRoute } from '../../base';
import { OfficeEditAmenitiesRoute } from '../edit/preview/sections/Amenities';
import { OfficeCreateDescriptionForm } from './OfficeCreateDescriptionForm';

const Component = () => {
  const { t } = useTranslation(['create_office']);

  const mutation = useCreateOffice();

  const isError = mutation.isError;
  const isLoading = mutation.isPending;

  const navigate = useNavigate({ from: CreateOfficeRoute.fullPath });

  function onSubmit(values: OfficeDescriptionType) {
    const data: CreateOfficeType = {
      officeName: values.officeName,
      officeAddress: values.officeAddress,
      officeAmenities: [],
    };
    mutation.mutateAsync(data).then((date) => {
      navigate({
        to: OfficeEditAmenitiesRoute.fullPath,
        params: {
          id: date.officeId,
        },
        search: {},
      });

      toast.success(t('create_office:messages.success.title'), {
        description: t('create_office:messages.success.description'),
      });
    });
  }

  if (mutation.isSuccess) {
    return <PageLoader />;
  }

  return (
    <MainLayout>
      <div className="container flex h-body items-center justify-center gap-[20rem]">
        <div className="w-1/2">
          <OfficeCreateDescriptionForm
            isError={isError}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        </div>
        <div>
          <img className="w-[34rem]" src="/img/office_create.svg" />
        </div>
      </div>
      <MobileNavigation from={CreateOfficeRoute.fullPath} />
    </MainLayout>
  );
};

export type OfficesParams = v.Output<typeof SearchSchema>;

export const CreateOfficeRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  path: '/offices/create',
  beforeLoad: ({ context }) => {
    if (!context.auth.managerProfile) {
      throw redirect({
        to: IndexRoute.fullPath,
      });
    }
  },
});
