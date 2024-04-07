import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { parse } from 'valibot';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import {
  OfficePictureType,
  POSTOfficePictureSchema,
} from '../../types/Picture';
import { handleDeletePicture } from './useDeletePicture';

export type ReorderPictureType = Pick<OfficePictureType, 'officeId'> & {
  file: File;
};

export const handleReorderPicture = async (data: ReorderPictureType) => {
  const response = await api.post(
    getFullApiPath(`/offices/${data.officeId}/pictures`),
    {
      contentType: data.file.type,
    },
  );

  const parsed = parse(POSTOfficePictureSchema, response.data);

  try {
    await axios.put(
      parsed.officePictureUploadUrl,
      data.file, //{ data: data.file },
      {
        headers: {
          'Content-Type': `${data.file.type}`,
        },
      },
    );
  } catch (error) {
    console.error(error);

    await handleDeletePicture({
      officeId: data.officeId,
      officePictureId: parsed.officePicture.officePictureId,
    });

    throw error;
  }

  return parsed;
};

export const useCreatePicture = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['create-picture'],
    mutationFn: async (data: ReorderPictureType) => handleReorderPicture(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.images.messages.post.error'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
    onSuccess: () => {
      toast.success(t('edit_office:edit_panel.images.messages.post.success'));

      queryClient.invalidateQueries({
        queryKey: ['office'],
      });
    },
  });

  return mutation;
};
