import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { array, object, Output, parse } from 'valibot';

import { api } from '../../lib/api';
import { handleCogintoError } from '../../lib/cognito/Errors';
import { OfficeAmenitySchema } from '../../types/Amenity';
import {
  OfficeAddressSchema,
  OfficeSchema,
  OfficeType,
} from '../../types/Office';

export const CreateOfficeSchema = object({
  officeName: OfficeSchema.entries.officeName,
  officeAddress: OfficeAddressSchema,
  officeAmenities: array(OfficeAmenitySchema),
});
export type CreateOfficeType = Output<typeof CreateOfficeSchema>;

const handleCreateOffice = async (
  data: CreateOfficeType,
): Promise<OfficeType> => {
  const response = await api.post('/offices', data);

  return parse(OfficeSchema, response.data);
};

export const useCreateOffice = () => {
  const { t } = useTranslation(['auth']);

  const mutation = useMutation({
    mutationKey: ['create_office'],
    mutationFn: handleCreateOffice,
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
  });

  return mutation;
};
