import { useCallback } from 'react';
import { DeepPartial } from 'react-hook-form';
import { intersect, object, Output, pick, string } from 'valibot';

import { useEditOfficeDescription } from '../../../mutations/offices/useEditOfficeDescription';
import { OfficeEditPreviewRoute } from '../../../routes/offices/edit/preview';
import { useOfficeEditStore } from '../../../stores/useOfficeEditStore';
import { OfficeAddressSchema, OfficeSchema } from '../../../types/Office';
import { OfficeEditDescriptionForm } from './OfficeEditDescriptionForm';

export const OfficeDescriptionSchema = intersect([
  pick(OfficeSchema, ['officeName']),
  object({
    address: string(),
    officeAddress: OfficeAddressSchema,
  }),
]);
export type OfficeDescriptionType = Output<typeof OfficeDescriptionSchema>;

export const OfficeEditDescriptionSection = () => {
  const officeId = OfficeEditPreviewRoute.useParams().id;

  const updateOffice = useOfficeEditStore((s) => s.updateOffice);
  const currentUpdatedOffice = useOfficeEditStore((s) => s.office);

  const handleOnWatch = useCallback(
    (updatedOffice: DeepPartial<OfficeDescriptionType>) => {
      delete updatedOffice.address;

      const officeName = updatedOffice.officeName;
      const officeAddress = updatedOffice.officeAddress ?? {};

      updateOffice({
        ...currentUpdatedOffice,
        officeName: officeName || currentUpdatedOffice.officeName,
        officeAddress: {
          city: officeAddress.city || currentUpdatedOffice.officeAddress.city,
          country:
            officeAddress.country || currentUpdatedOffice.officeAddress.country,
          latitude:
            officeAddress.latitude ||
            currentUpdatedOffice.officeAddress.latitude,
          longitude:
            officeAddress.longitude ||
            currentUpdatedOffice.officeAddress.longitude,
          postalCode:
            officeAddress.postalCode ||
            currentUpdatedOffice.officeAddress.postalCode,
          province:
            officeAddress.province ||
            currentUpdatedOffice.officeAddress.province,
          street1:
            officeAddress.street1 || currentUpdatedOffice.officeAddress.street1,
          street2:
            officeAddress.street2 || currentUpdatedOffice.officeAddress.street2,
        },
      });
    },
    [currentUpdatedOffice, updateOffice],
  );

  const mutation = useEditOfficeDescription();

  function onSubmit(values: OfficeDescriptionType) {
    mutation.mutate({
      officeId,
      data: values,
    });
  }
  const isError = mutation.isError;
  const isLoading = mutation.isPending;

  return (
    <OfficeEditDescriptionForm
      isError={isError}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onWatch={handleOnWatch}
    />
  );
};
