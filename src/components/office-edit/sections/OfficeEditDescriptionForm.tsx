import { valibotResolver } from '@hookform/resolvers/valibot';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DeepPartial, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { object, Output, string } from 'valibot';

import { useFullAddress } from '../../../hooks/useFullAddress';
import { cn } from '../../../lib/utils';
import { fetchOfficeDetailsQuery } from '../../../routes/offices/details/loader';
import { OfficeEditDescriptionRoute } from '../../../routes/offices/edit/preview/sections/Description';
import { OfficeAddressSchema, OfficeSchema } from '../../../types/Office';
import { SubmitButton } from '../../form/SubmitButton';
import {
  AutocompleteInput,
  FormattedPlace,
} from '../../google-map/autocomplete-input/AutocompleteInput';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';

export type OfficeEditDescriptionFormProps = {
  onPlaceChange?: (addressData: FormattedPlace) => void;
  onSubmit: (values: OfficeDescriptionType) => void;
  isError: boolean;
  isLoading: boolean;
  onWatch?: (updatedOffice: DeepPartial<OfficeDescriptionType>) => void;
  className?: string;
  isCreate?: boolean;
};

export const OfficeDescriptionSchema = object({
  officeName: OfficeSchema.entries.officeName,
  address: string(),
  officeAddress: OfficeAddressSchema,
});
export type OfficeDescriptionType = Output<typeof OfficeDescriptionSchema>;

export const OfficeEditDescriptionForm = ({
  className,
  onPlaceChange: onPlaceChange,
  onSubmit,
  isError,
  isLoading,
  onWatch,
  isCreate = false,
}: OfficeEditDescriptionFormProps) => {
  const { t } = useTranslation(['edit_office', 'office']);

  const officeId = OfficeEditDescriptionRoute.useParams().id;

  const officeQuery = useSuspenseQuery(
    fetchOfficeDetailsQuery({ officeId: officeId }),
  );

  const office = officeQuery.data;

  const officeFullAddress = useFullAddress({
    lat: office.officeAddress.latitude,
    lng: office.officeAddress.longitude,
  });

  const form = useForm<OfficeDescriptionType>({
    resolver: valibotResolver(OfficeDescriptionSchema),
    defaultValues: {
      officeName: office.officeName,
      address: officeFullAddress ?? '',
      officeAddress: office.officeAddress,
    },
  });

  useEffect(() => {
    form.setValue('address', officeFullAddress ?? '');
  }, [form, officeFullAddress]);

  useEffect(() => {
    const sub = form.watch((updatedOffice) => onWatch?.(updatedOffice));

    return () => {
      sub.unsubscribe();
    };
  }, [form, form.watch, onWatch]);

  const handleOnPlaceChange = (addressData: FormattedPlace) => {
    const place = addressData.address.longAddress;

    form.setValue('officeAddress.street1', place.street1);
    form.setValue('officeAddress.city', place.city);
    form.setValue('officeAddress.country', place.country);
    form.setValue('officeAddress.province', place.province);
    form.setValue('officeAddress.postalCode', place.postalCode);
    form.setValue('officeAddress.latitude', addressData.geolocation.lat);
    form.setValue('officeAddress.longitude', addressData.geolocation.lng);

    form.trigger('officeAddress.street2');

    onPlaceChange?.(addressData);
  };

  const isDirty = form.formState.isDirty;

  const _isError = !form.formState.isValid || isError;

  return (
    <Card className={cn('w-full', className)}>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <CardHeader>
              <CardTitle>
                {t(
                  isCreate
                    ? 'edit_office:edit_panel.create_title'
                    : 'edit_office:edit_panel.edit_title',
                )}
              </CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="officeName"
                render={({ field }) => (
                  <FormItem className="grid w-full items-center gap-1.5">
                    <FormLabel>
                      {t('edit_office:edit_panel.fields.officeName.label')}
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
                name="address"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { ref: _, ...fieldProps } }) => (
                  <FormItem className="grid w-full items-center gap-1.5">
                    <FormLabel>
                      {t('edit_office:edit_panel.fields.address.label')}
                    </FormLabel>
                    <FormControl>
                      <AutocompleteInput
                        {...fieldProps}
                        onPlaceChanged={handleOnPlaceChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeAddress.street2"
                render={({ field: { value, ...fieldProps } }) => (
                  <FormItem className="grid w-full items-center gap-1.5">
                    <FormLabel>
                      {t('edit_office:edit_panel.fields.street2.label')}
                    </FormLabel>
                    <FormControl>
                      <Input {...fieldProps} value={value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                disabled={_isError || !isDirty}
                isLoading={isLoading}
              />
            </CardBody>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};
