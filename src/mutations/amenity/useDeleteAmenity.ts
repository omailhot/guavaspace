import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { AmenityType } from '../../types/Amenity';
import { OfficeType } from '../../types/Office';

export type DeleteAmenityType = {
  officeId: OfficeType['officeId'];
  amenityId: AmenityType['amenityId'];
};

export const handleReorderAmenity = async (data: DeleteAmenityType) => {
  await api.delete(
    getFullApiPath(`/offices/${data.officeId}/amenities/${data.amenityId}`),
  );
};

export const useDeleteAmenity = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['delete-amenity'],
    mutationFn: async (data: DeleteAmenityType) => handleReorderAmenity(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.features.messages.delete.error'));
    },
    onSuccess: () => {
      toast.success(
        t('edit_office:edit_panel.features.messages.delete.success'),
      );

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
