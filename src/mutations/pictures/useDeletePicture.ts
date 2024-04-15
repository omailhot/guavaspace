import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { OfficeType } from '../../types/Office';
import { OfficePictureType } from '../../types/Picture';

export type DeletePictureType = {
  officeId: OfficeType['officeId'];
  officePictureId: OfficePictureType['officePictureId'];
};

export const handleDeletePicture = async (data: DeletePictureType) => {
  await api.delete(
    getFullApiPath(
      `/offices/${data.officeId}/pictures/${data.officePictureId}`,
    ),
  );
};

export const useDeletePicture = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['delete-images'],
    mutationFn: async (data: DeletePictureType) => handleDeletePicture(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.images.messages.delete.error'));
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.images.messages.delete.success'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
