import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { api } from '../../lib/api';
import { getFullApiPath } from '../../lib/path';
import { queryClient } from '../../main';
import { RentalOfferType } from '../../types/Office';

type Params = {
  rentalOfferId: RentalOfferType['rentalOfferId'];
  officeId: RentalOfferType['officeId'];
};

const handle = async (data: Params) => {
  await api.delete(
    getFullApiPath(
      `/offices/${data.officeId}/rental-offers/${data.rentalOfferId}`,
    ),
  );
};

export const useDeleteRentalOffer = () => {
  const { t } = useTranslation(['office_edit']);

  const mutation = useMutation({
    mutationKey: ['delete-rental-offer'],
    mutationFn: async (data: Params) => handle(data),
    onError: () => {
      toast.error(t('edit_office:edit_panel.rentals.messages.delete.error'));
    },
    onSuccess: () => {
      toast.success(
        t('edit_office:edit_panel.rentals.messages.delete.success'),
      );

      queryClient.invalidateQueries({
        queryKey: ['office-rental-offers'],
      });
    },
  });

  return mutation;
};
