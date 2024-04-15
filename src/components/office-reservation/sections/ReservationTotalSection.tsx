import { useTranslation } from 'react-i18next';

import { SmartSkeleton } from '@/components/SmartSkeleton';
import { cn } from '@/lib/utils';

type Props = {
  isLoading: boolean;
  totalDays: number;
  rentalPrice: number;
  totalPrice: number;
  seats: number;
  className?: string;
};

export const ReservationTotalSection = ({
  isLoading,
  totalDays,
  rentalPrice,
  totalPrice,
  seats,
  className,
}: Props) => {
  const { t } = useTranslation('reservation');

  const currency = ` ${t('translation:currency.canadian')}`;

  return (
    <section className={cn('flex flex-col gap-3 divide-y', className)}>
      <div className="flex justify-between">
        <SmartSkeleton className="h-[1rem] w-60" isLoading={isLoading}>
          <span className="font-bold">{totalDays} </span>
          {`${t('reservation:side_details.days', { count: totalDays })} x `}
          <span className="font-bold">{seats} </span>
          {`${t('reservation:side_details.seats', { count: seats })} x `}
          <span className="font-bold">{rentalPrice}</span>
          {currency}
        </SmartSkeleton>
        <SmartSkeleton className="h-[1rem] w-24" isLoading={isLoading}>
          <span className="font-bold">{rentalPrice * totalDays * seats}</span>
          {currency}
        </SmartSkeleton>
      </div>
      <div className="flex justify-between pt-3">
        <div>{t('reservation:total')}</div>
        <div>
          <SmartSkeleton className="h-[1rem] w-24" isLoading={isLoading}>
            <span className="font-bold">{totalPrice}</span>
            {currency}
          </SmartSkeleton>
        </div>
      </div>
    </section>
  );
};
