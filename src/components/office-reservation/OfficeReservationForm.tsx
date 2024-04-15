import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeAddressElementOptions } from '@stripe/stripe-js';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateRental } from '@/mutations/useCreateRental';
import { useAuthContext } from '@/contexts/AuthContext';
import { OfficeReservationConfirmationRoute } from '@/routes/offices/confirmation';
import { OfficeDetailsRoute } from '@/routes/offices/details';
import { OfficeReservationRoute } from '@/routes/offices/reservation';
import { useReservationStore } from '@/stores/useReservationStore';

import { Button } from '../ui/button';

type Props = {
  officeId: string;
};

export const OfficeReservationForm = ({ officeId }: Props) => {
  const navigate = useNavigate({ from: OfficeReservationRoute.fullPath });
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation('reservation');
  const { user } = useAuthContext();
  const rental = useCreateRental();

  const data = useReservationStore((s) => s.data);

  if (!data) {
    navigate({
      to: OfficeDetailsRoute.fullPath,
      params: { id: officeId },
    });
    return null;
  }

  const testAddressOptions: StripeAddressElementOptions = {
    mode: 'billing',
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    elements?.submit();

    const result = await stripe.createConfirmationToken({
      elements,
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      rental.mutate({
        officeId,
        startDate: format(data.from, 'yyyy-MM-dd'),
        endDate: format(data.to, 'yyyy-MM-dd'),
        seats: data.seats,
        email: { email: user?.email || 'olivier.mailhot2@.com' },
      });
      navigate({
        to: OfficeReservationConfirmationRoute.fullPath,
        params: { id: officeId },
      });
    }
  };

  // To test card: 4242 4242 4242 4242
  // Use a valid future date, such as 12/34.
  // Use any three-digit CVC (four digits for American Express cards).
  // Use any value you like for other form fields.
  return (
    <form onSubmit={handleSubmit}>
      <AddressElement options={testAddressOptions} />
      <PaymentElement />
      <Button className="mt-6 w-full" disabled={!stripe} type="submit">
        {t('reservation:confirmAndPay')}
      </Button>
    </form>
  );
};
