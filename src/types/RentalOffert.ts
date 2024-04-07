import { parseISO } from 'date-fns';
import {
  coerce,
  date,
  intersect,
  number,
  object,
  Output,
  string,
} from 'valibot';

import { OfficeSchema } from './Office';

export const CreateRentalOfferSchema = object({
  startDate: coerce(date(), (i: any) => parseISO(i)),
  endDate: coerce(date(), (i: any) => parseISO(i)),
  dailyPricePerSeat: number(),
  seatsAvailable: number(),
});
export type CreateRentalOfferType = Output<typeof CreateRentalOfferSchema>;

export const RentalOfferSchema = intersect([
  object({
    rentalOfferId: string(),
    office: OfficeSchema,
  }),
  CreateRentalOfferSchema,
]);
export type RentalOfferType = Output<typeof RentalOfferSchema>;
