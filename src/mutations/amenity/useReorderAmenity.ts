import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { parse } from 'valibot';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import {
  AmenityType,
  OfficeAmenitySchema,
  OfficeAmenityType,
} from '../../types/Amenity';
import { OfficeType } from '../../types/Office';

export type ReorderAmenityType = {
  amenityOrder: OfficeAmenityType['amenityOrder'];
  amenityId: AmenityType['amenityId'];
  officeId: OfficeType['officeId'];
};

export const handleReorderAmenity = async (data: ReorderAmenityType) => {
  const response = await api.put(
    getFullApiPath(`/offices/${data.officeId}/amenities/${data.amenityId}`),
    {
      amenityOrder: data.amenityOrder,
    },
  );

  return parse(OfficeAmenitySchema, response.data);
};

export const useReorderAmenity = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['reorder-amenity'],
    mutationFn: async (data: ReorderAmenityType) => handleReorderAmenity(data),
    onError: () => {
      toast.error('edit_office:edit_panel.features.messages.put.error');
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.features.messages.put.success'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
