'use client';

import { addDays, addMonths, format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

import { FormControl, FormField, FormItem } from '../../ui/form';
import { SearchFormProps } from './SearchForm';

type Props = {
  className?: string;
};

export const DatePickerWithRange = (
  { form }: SearchFormProps,
  { className }: Props,
) => {
  const { t } = useTranslation('search');

  const locale = useLocale();

  const handleCalendarTitle = () => {
    const from = form.getValues('dateRange.from');
    const to = form.getValues('dateRange.to');
    if (!to && from) {
      return format(from, 'LLL dd, y', { locale });
    }
    if (from && to) {
      return `${format(from, 'LLL dd, y', { locale })} - ${format(to, 'LLL dd, y', { locale })}`;
    }
    return t('search:date');
  };

  const today = new Date();

  return (
    <div className={cn('grid gap-2', className)}>
      <FormField
        control={form.control}
        name="dateRange"
        render={() => (
          <FormItem>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      'w-full min-w-60 justify-start text-left font-normal',
                      !form.getValues('dateRange.from') &&
                        'text-muted-foreground',
                    )}
                    id="date"
                    variant="outline"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {handleCalendarTitle()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    defaultMonth={form.getValues('dateRange.from')}
                    disabled={{
                      from: addMonths(today, -1),
                      to: addDays(today, -1),
                    }}
                    fromMonth={today}
                    initialFocus
                    locale={locale}
                    mode="range"
                    numberOfMonths={2}
                    onSelect={(date) => {
                      form.setValue('dateRange', {
                        from: date?.from,
                        to: date?.to,
                      });
                    }}
                    selected={{
                      from: form.getValues('dateRange.from'),
                      to: form.getValues('dateRange.to'),
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
