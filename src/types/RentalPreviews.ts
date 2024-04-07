import * as v from 'valibot';

import { OfficeSchema } from './Office';

export const RentalPreviewSchema = v.object({
  startDate: v.coerce(v.date(), (i: any) => new Date(i)),
  endDate: v.coerce(v.date(), (i: any) => new Date(i)),
  office: OfficeSchema,
  avgDailyPricePerSeat: v.number(),
  seatsAvailable: v.number(),
});
export type RentalPreviewType = v.Output<typeof RentalPreviewSchema>;
