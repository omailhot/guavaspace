import { addDays } from 'date-fns';
import * as v from 'valibot';

export const GET_DEFAULT_ADDRESS = () => '';
export const GET_DEFAULT_FROM_DATE = () => addDays(new Date(), 1);
export const GET_DEFAULT_TO_DATE = (fromDate?: Date) =>
  addDays(fromDate ?? GET_DEFAULT_FROM_DATE(), 2);
export const GET_DEFAULT_SEATS = () => 1;
export const GET_DEFAULT_ROOMS = () => 0;

export const SearchSchema = v.object({
  capacity: v.object({
    seats: v.number([v.minValue(0), v.maxValue(9999)]),
    rooms: v.number([v.minValue(0), v.maxValue(9999)]),
  }),
  location: v.object({
    address: v.fallback(v.string(), GET_DEFAULT_ADDRESS),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  }),
  dateRange: v.object({
    from: v.coerce(v.date(), (i: any) => new Date(i)),
    to: v.coerce(v.date(), (i: any) => new Date(i)),
  }),
});

export type SearchType = v.Output<typeof SearchSchema>;

export const SearchFormSchema = v.object({
  capacity: v.object({
    seats: v.number([v.minValue(0), v.maxValue(9999)]),
    rooms: v.number([v.minValue(0), v.maxValue(9999)]),
  }),
  location: v.object({
    address: v.fallback(v.string(), GET_DEFAULT_ADDRESS),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  }),
  dateRange: v.object({
    from: v.optional(v.coerce(v.date(), (i: any) => new Date(i))),
    to: v.optional(v.coerce(v.date(), (i: any) => new Date(i))),
  }),
});

export type SearchFormType = v.Output<typeof SearchFormSchema>;
