import { createRoute, Link } from '@tanstack/react-router';
import { addDays, parseISO } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  coerce,
  date,
  fallback,
  number,
  object,
  optional,
  Output,
  parse,
} from 'valibot';

import { OfficeDetails } from '../../../components/office-details/OfficeDetails';
import { BaseRoute } from '../../base';
import { IndexRoute } from '../../home';
import { fetchOfficeDetailsQuery } from './loader';

const Component = () => {
  const office = OfficeDetailsRoute.useLoaderData();
  const { t } = useTranslation(['office']);

  return (
    <div>
      <div className="container my-10">
        <Link
          className="flex  items-center [&>*]:text-primary"
          to={IndexRoute.fullPath}
        >
          <ChevronLeft />
          <span className="text-lg">{t('office:details.breadcrumb')}</span>
        </Link>
      </div>
      <div>
        <OfficeDetails office={office} />
      </div>
    </div>
  );
};

export const GET_DEFAULT_FROM_DATE = () => new Date();
export const GET_DEFAULT_TO_DATE = () => addDays(GET_DEFAULT_FROM_DATE(), 2);
export const GET_DEFAULT_SEATS = () => 1;
export const GET_DEFAULT_ROOMS = () => 0;

export const OfficeDetailsSearchParamsSchema = object({
  to: optional(coerce(date(), (i: any) => parseISO(i))),
  from: optional(coerce(date(), (i: any) => parseISO(i))),
  seats: optional(number()),
  rooms: optional(number()),
});

export const OfficeDetailsSearchParamsSchemaWithDefaults = object({
  to: fallback(
    coerce(date(), (i: any) => new Date(i)),
    GET_DEFAULT_TO_DATE(),
  ),
  from: fallback(
    coerce(date(), (i: any) => new Date(i)),
    GET_DEFAULT_FROM_DATE(),
  ),
  seats: fallback(number(), GET_DEFAULT_SEATS()),
  rooms: fallback(number(), GET_DEFAULT_ROOMS()),
});

export type OfficeDetailsSearchParamsType = Output<
  typeof OfficeDetailsSearchParamsSchema
>;

export const OfficeDetailsRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(fetchOfficeDetailsQuery({ officeId: id })),
  path: '/offices/$id',
  validateSearch: (search) => parse(OfficeDetailsSearchParamsSchema, search),
});
