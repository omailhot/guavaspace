import { useTranslation } from 'react-i18next';

import { cn } from '../../../../lib/utils';
import { SmartSkeleton } from '../../../SmartSkeleton';

type Props = {
  isLoading: boolean;
  totalDays: number;
  rentalPrice?: number;
  totalPrice: number;
  className?: string;
};

export const RentPanelTotalSection = ({
  isLoading,
  totalDays,
  rentalPrice,
  totalPrice,
  className,
}: Props) => {
  const { t } = useTranslation(['office']);

  return (
    <div className={cn('flex flex-col gap-3 divide-y', className)}>
      <SmartSkeleton className="h-[1rem] w-48" isLoading={isLoading}>
        <span className="font-bold">{totalDays} </span>
        {`${t('office:rent_panel.days', { count: totalDays })} x `}
        <span className="font-bold">{rentalPrice}</span> CAD$
      </SmartSkeleton>
      <div className="flex justify-between pt-3">
        <div>Total</div>
        <div>
          <SmartSkeleton className="h-[1rem] w-24" isLoading={isLoading}>
            <span className="font-bold">{totalPrice}</span> CAD$
          </SmartSkeleton>
        </div>
      </div>
    </div>
  );
};
