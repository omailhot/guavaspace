import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { safeParse } from 'valibot';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { AmenityType, OfficeAmenitySchema } from '../../types/Amenity';
import { OfficeType } from '../../types/Office';

export type AddAmenityType = {
  officeId: OfficeType['officeId'];
  amenityId: AmenityType['amenityId'];
};

export const handleAddAmenity = async (data: AddAmenityType) => {
  const response = await api.post(
    getFullApiPath(`/offices/${data.officeId}/amenities`),
    {
      amenityId: data.amenityId,
    },
  );

  const parsed = safeParse(OfficeAmenitySchema, response.data);

  return parsed.output;
};

export const useAddAmenity = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['reorder-amenity'],
    mutationFn: async (data: AddAmenityType) => handleAddAmenity(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.features.messages.post.error'));
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.features.messages.post.success'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
