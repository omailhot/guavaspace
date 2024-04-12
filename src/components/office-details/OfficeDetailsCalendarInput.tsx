import { useNavigate } from '@tanstack/react-router';
import { format, Locale } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useRef } from 'react';
import { parse } from 'valibot';

import { useOfficeContext } from '../../contexts/OfficeContext';
import { useLocale } from '../../hooks/useLocale';
import { cn } from '../../lib/utils';
import {
  GET_DEFAULT_FROM_DATE,
  OfficeDetailsSearchParamsSchemaWithDefaults,
} from '../../routes/offices/details';
import { CalendarInput, CalendarInputRef } from '../form/CalendarInput';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { getOfficeRoute } from './OfficeDetails';

type Props = {
  className?: string;
  disabled?: boolean;
  numberOfMonths?: number;
};

function formatDate(date: Date, locale: Locale) {
  return format(date, 'LLL dd', { locale });
}

export const formatDateInput = (from: Date, to: Date, locale: Locale) => {
  const parts = [formatDate(from, locale)];

  if (to) {
    parts.push(formatDate(to, locale));
  }

  return parts.join(' - ');
};

export const OfficeDetailsCalendarInput = ({
  className,
  disabled,
  numberOfMonths,
}: Props) => {
  const { isEdit } = useOfficeContext();
  const route = getOfficeRoute(isEdit);
  const navigate = useNavigate({ from: route.fullPath });
  const searchParams = route.useSearch();

  const searchWithDefaults = parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    searchParams,
  );

  const locale = useLocale();

  const dateRef = useRef<CalendarInputRef>(null);

  const handleOnOpenChange = () => {
    if (!dateRef.current) return;

    navigate({
      search: (old) => ({
        ...old,
        from: dateRef.current?.from ?? GET_DEFAULT_FROM_DATE(),
        to: dateRef.current?.to ?? GET_DEFAULT_FROM_DATE(),
      }),
      resetScroll: false,
    });
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) return;

        handleOnOpenChange();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-full justify-start text-left font-normal',
            !searchWithDefaults && 'text-muted-foreground',
          )}
          disabled={disabled}
          id="date"
          variant="outline"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {formatDateInput(
            searchWithDefaults.from,
            searchWithDefaults.to,
            locale,
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <CalendarInput
          className={className}
          defaultDate={searchWithDefaults}
          numberOfMonths={numberOfMonths}
          ref={dateRef}
        />
      </PopoverContent>
    </Popover>
  );
};
