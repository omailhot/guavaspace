import { number, object, Output, string } from 'valibot';

export const AmenitySchema = object({
  amenityId: string(),
  amenityKey: string(),
});
export type AmenityType = Output<typeof AmenitySchema>;

export const OfficeAmenitySchema = object({
  officeId: string(),
  amenity: AmenitySchema,
  amenityOrder: number(),
});

export type OfficeAmenityType = Output<typeof OfficeAmenitySchema>;
