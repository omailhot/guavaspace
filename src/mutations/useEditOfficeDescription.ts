import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { OfficeDescriptionType } from '../components/office-edit/sections/OfficeEditDescriptionSection';
import { api, handleAPIError } from '../lib/api';
import { getFullApiPath } from '../lib/path';
import { OfficeType } from '../types/Office';

type EditOfficeParams = {
  officeId: OfficeType['officeId'];
  data: OfficeDescriptionType;
};

export const handleEditOfficeDescription = async ({
  officeId,
  data,
}: EditOfficeParams) => {
  const response = await api.post(getFullApiPath(`/offices/${officeId}`), {
    data,
  });

  return response.data;
};

export const useEditOfficeDescription = () => {
  const { t } = useTranslation(['edit_office']);

  const mutation = useMutation({
    mutationFn: (params: EditOfficeParams) =>
      handleEditOfficeDescription(params),
    onError: (error: any) => {
      const parsedError = handleAPIError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success(t('edit_office:description_panel.success'));
    },
  });

  return mutation;
};
