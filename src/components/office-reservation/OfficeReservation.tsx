import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Link, redirect } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLocale } from '@/hooks/useLocale';
import { OfficeDetailsRoute } from '@/routes/offices/details';
import { OfficeReservationRoute } from '@/routes/offices/reservation';
import { useReservationStore } from '@/stores/useReservationStore';

import { Logo } from '../navigation/Logo';
import { OfficeReservationForm } from './OfficeReservationForm';
import { OfficeReservationSideDetails } from './OfficeReservationSideDetails';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const OfficeReservation = () => {
  const office = OfficeReservationRoute.useLoaderData();
  const { t } = useTranslation('reservation');
  const locale = useLocale();

  const data = useReservationStore((s) => s.data);

  if (!data) {
    redirect({
      to: OfficeDetailsRoute.fullPath,
      params: {
        id: office.officeId,
      },
    });
    return null;
  }

  const testOptions: StripeElementsOptions = {
    mode: 'payment',
    currency: 'cad',
    amount: 200,
  };

  return (
    <div>
      <div className="container">
        <div className="hidden p-6 md:flex">
          <Logo />
        </div>
        <Link
          className="text-md my-4 flex items-center text-primary md:text-lg"
          params={{ id: office.officeId }}
          to={OfficeDetailsRoute.fullPath}
        >
          <ChevronLeft />
          <span>{t('reservation:returnToDetails')}</span>
        </Link>
        <div className="flex flex-col justify-between gap-2 md:mt-8 md:flex-row-reverse md:gap-8">
          <OfficeReservationSideDetails className="mt-6" office={office} />
          <div className="flex flex-grow flex-col md:pl-6">
            <h1 className="mt-6 text-xl font-medium md:mt-0 md:text-2xl">
              {t('reservation:yourReservation')}
            </h1>
            <div className="mt-6 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-semibold">
                  {t('reservation:dates')}
                </h3>
                <p className="text-muted-foreground">{`${data.from.toLocaleDateString(
                  locale.code,
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )} - ${data.to.toLocaleDateString(locale.code, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">
                  {t('translation:capacity.title')}
                </h3>
                <p className="text-muted-foreground">{`${data.seats} ${t('translation:capacity.seat_other')}, 0 ${t('translation:capacity.room_other')}`}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-semibold">
                  {t('reservation:payment')}
                </h3>
                <div className="rounded-md border p-4 shadow-sm">
                  <Elements options={testOptions} stripe={stripePromise}>
                    <OfficeReservationForm officeId={office.officeId} />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
