import { number, object, Output, string } from 'valibot';

export const OfficePictureSchema = object({
  officePictureId: string(),
  officeId: string(),
  picturePath: string(),
  pictureOrder: number(),
});
export type OfficePictureType = Output<typeof OfficePictureSchema>;

export const POSTOfficePictureSchema = object({
  officePicture: OfficePictureSchema,
  officePictureUploadUrl: string(),
});

export type POSTOfficePictureType = Output<typeof POSTOfficePictureSchema>;
