import { parseISO } from 'date-fns';
import * as v from 'valibot';

import { OfficeAmenitySchema } from './Amenity';
import { CompanySchema } from './Company';
import { OfficePictureSchema } from './Picture';

export const RentalOfferSchema = v.object({
  rentalOfferId: v.string(),
  officeId: v.string(),

  startDate: v.coerce(v.date(), (i: any) => parseISO(i)),
  endDate: v.coerce(v.date(), (i: any) => parseISO(i)),

  dailyPricePerSeat: v.number(),
  seatsAvailable: v.number(),
  minDurationDays: v.number(),
});
export type RentalOfferType = v.Output<typeof RentalOfferSchema>;

export const OfficeAddressSchema = v.object({
  street1: v.string(),
  street2: v.nullable(v.string()),
  city: v.string(),
  province: v.string(),
  country: v.string(),
  postalCode: v.string(),
  latitude: v.fallback(v.number(), 0),
  longitude: v.fallback(v.number(), 0),
});
export type OfficeAddressType = v.Output<typeof OfficeAddressSchema>;

export const OfficeSchema = v.object({
  officeId: v.string(),

  officeName: v.string(),
  description: v.fallback(v.optional(v.string()), 'This is a test'),

  officeAddress: OfficeAddressSchema,
  company: CompanySchema,
  officePictures: v.array(OfficePictureSchema),
  officeAmenities: v.array(OfficeAmenitySchema),
});
export type OfficeType = v.Output<typeof OfficeSchema>;
