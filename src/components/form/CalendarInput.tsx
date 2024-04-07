import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useLocale } from '../../hooks/useLocale';
import { cn } from '../../lib/utils';
import { Calendar } from '../ui/calendar';

type Props = {
  className?: string;
  onChange?: (range: DateRange | undefined) => void;
  defaultDate?: DateRange;
  disabledDates?: DateRange[];
  numberOfMonths?: number;
  value?: DateRange | null | undefined;
};

export type CalendarInputRef = DateRange | undefined | null;

export const CalendarInput = forwardRef<CalendarInputRef, Props>(
  (
    {
      className,
      onChange,
      defaultDate,
      numberOfMonths = 2,
      value,
      disabledDates,
    },
    ref,
  ) => {
    const locale = useLocale();

    const [state, setState] = useState<DateRange | undefined | null>(
      defaultDate,
    );

    useEffect(() => {
      setState(value);
    }, [value]);

    const handleOnDateChange = (range: DateRange | undefined) => {
      setState(range);
      onChange?.(range);
    };

    useImperativeHandle(ref, () => state ?? undefined, [state]);

    return (
      <div className={cn(className)}>
        <Calendar
          defaultMonth={state?.from ?? new Date()}
          disabled={disabledDates}
          locale={locale}
          mode="range"
          numberOfMonths={numberOfMonths}
          onSelect={handleOnDateChange}
          selected={state ?? undefined}
        />
      </div>
    );
  },
);

CalendarInput.displayName = 'CalendarInput';
