import { Label } from '@radix-ui/react-label';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parse } from 'valibot';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useOfficeContext } from '../../contexts/OfficeContext';
import {
  GET_DEFAULT_ROOMS,
  GET_DEFAULT_SEATS,
  OfficeDetailsSearchParamsSchemaWithDefaults,
} from '../../routes/offices/details';
import { getOfficeRoute } from '../office-details/OfficeDetails';

const MAX_VALUE = 9999;

function formatValue(value: number) {
  value = Math.max(0, value);
  value = Math.min(MAX_VALUE, value);

  return value;
}

const sections = ['SEAT', 'ROOM'] as const;

type SectionKey = (typeof sections)[number];

type Props = {
  disabled?: boolean;
};

export const CapacityInput = ({ disabled }: Props) => {
  const { isEdit } = useOfficeContext();
  const route = getOfficeRoute(isEdit);

  const { t } = useTranslation(['search']);
  const searchParams = route.useSearch();

  const navigate = useNavigate({ from: route.fullPath });

  const searchWithDefaults = parse(
    OfficeDetailsSearchParamsSchemaWithDefaults,
    searchParams,
  );

  const [state, setState] = useState({
    rooms: searchWithDefaults.rooms,
    seats: searchWithDefaults.seats,
  });

  const handleValueChange = (section: SectionKey, value: number) => {
    setState((old) => ({
      ...old,
      [section === 'ROOM' ? 'rooms' : 'seats']: formatValue(value),
    }));
  };

  const inputLabel = useMemo(() => {
    const label: string[] = [];
    if (searchWithDefaults.seats) {
      label.push(
        `${searchWithDefaults.seats} ${t('search:capacity.seat', { count: searchWithDefaults.seats })}`,
      );
    }

    if (searchWithDefaults.rooms) {
      label.push(
        `${searchWithDefaults.rooms} ${t('search:capacity.room', { count: searchWithDefaults.rooms })}`,
      );
    }

    return label.length ? label.join(' ') : t('search:capacity.title');
  }, [searchWithDefaults.rooms, searchWithDefaults.seats, t]);

  const handleClose = () => {
    navigate({
      search: (old: any) => ({
        ...old,
        ...state,
      }),
    });
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) return;

        handleClose();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'min-w-52 justify-start font-normal',
            !state.seats && !state.rooms && 'text-muted-foreground',
          )}
          disabled={disabled}
          variant="outline"
        >
          <UsersRound className="mr-2" size={16} />
          {inputLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {t('search:capacity.title')}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t('search:capacity.description')}
            </p>
          </div>
          <div className="grid gap-2">
            {sections.map((section) => {
              const value =
                section === 'ROOM'
                  ? state.rooms ?? GET_DEFAULT_ROOMS()
                  : state.seats ?? GET_DEFAULT_SEATS();
              const transKey = section === 'ROOM' ? 'room' : 'seat';

              return (
                <div
                  className="flex items-center justify-stretch gap-3"
                  key={section}
                >
                  <div className="w-2/5">
                    <Label htmlFor="seats">
                      {t(`search:capacity.${transKey}`, { count: 0 })}
                    </Label>
                  </div>
                  <div className="flex h-full gap-1">
                    <Button
                      className="h-full"
                      disabled={disabled || value === 0}
                      onClick={() => handleValueChange(section, value - 1)}
                      size="sm"
                      variant="outline"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      className="text-center focus-visible:ring-0"
                      disabled={disabled}
                      id="seats"
                      inputMode="numeric"
                      onChange={(e) =>
                        handleValueChange(section, Number(e.target.value))
                      }
                      type="number"
                      value={value}
                    />
                    <Button
                      className="h-full"
                      disabled={disabled || value === MAX_VALUE}
                      onClick={() => handleValueChange(section, value + 1)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
