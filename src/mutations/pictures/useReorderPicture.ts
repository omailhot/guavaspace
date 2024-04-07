import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { safeParse } from 'valibot';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { OfficePictureSchema, OfficePictureType } from '../../types/Picture';

export type ReorderPictureType = Pick<
  OfficePictureType,
  'officePictureId' | 'pictureOrder' | 'officeId'
>;

export const handleReorderPicture = async (data: ReorderPictureType) => {
  const response = await api.put(
    getFullApiPath(
      `/offices/${data.officeId}/pictures/${data.officePictureId}`,
    ),
    {
      pictureOrder: data.pictureOrder,
    },
  );

  const parsed = safeParse(OfficePictureSchema, response.data);

  return parsed.output;
};

export const useReorderPicture = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['reorder-picture'],
    mutationFn: async (data: ReorderPictureType) => handleReorderPicture(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.images.messages.put.error'));
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.images.messages.put.success'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
