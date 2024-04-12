import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { array, number, object, Output, parse, string } from 'valibot';

import { api } from '../lib/api';
import { handleCogintoError } from '../lib/cognito/Errors';
import { AmenitySchema } from '../types/Amenity';
import { OfficeAddressSchema, OfficeSchema } from '../types/Office';

export const ReservationSchema = object({
  officeName: OfficeSchema.entries.officeName,
  officeAddress: OfficeAddressSchema,
  numberOfPictures: number(),
  officeAmenities: array(AmenitySchema),
});

export type ReservationType = Output<typeof ReservationSchema>;

export const ReservationResponseSchema = object({
  office: OfficeSchema,
  officePictureUploadUrls: array(string()),
});
export type ReservationResponseType = Output<typeof ReservationResponseSchema>;

const handleReservation = async (
  data: ReservationType,
): Promise<ReservationResponseType> => {
  const response = await api.post('/offices/$id/rentals', data);

  return parse(ReservationResponseSchema, response.data);
};

export const useCreateOffice = () => {
  const { t } = useTranslation(['auth']);

  const mutation = useMutation({
    mutationKey: ['reservation'],
    mutationFn: handleReservation,
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
  });

  return mutation;
};
