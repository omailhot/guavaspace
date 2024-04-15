import * as v from 'valibot';

import { OfficeSchema } from './Office';

export const RentalsSchema = v.object({
  rentalId: v.string(),
  office: OfficeSchema,
  customerProfileId: v.string(),
  startDate: v.coerce(v.date(), (i: any) => new Date(i)),
  endDate: v.coerce(v.date(), (i: any) => new Date(i)),
  dailyPricePerSeatPaid: v.number(),
  seats: v.number(),
});
export type RentalsType = v.Output<typeof RentalsSchema>;
