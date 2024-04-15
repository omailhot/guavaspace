import { Label } from '@radix-ui/react-label';
import { Minus, Plus, UsersRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { SearchFormProps } from '../SearchForm';

export const Capacity = ({ form }: SearchFormProps) => {
  const { t } = useTranslation('search');

  const increment = (count: number) => (count < 9999 ? count + 1 : 9999);
  const decrement = (count: number) => (count > 0 ? count - 1 : 0);

  const popoverTitle = () => {
    const seats = form.getValues('capacity').seats;
    const rooms = form.getValues('capacity').rooms;
    if (!seats && !rooms) {
      return t('translation:capacity.title');
    }
    if (!seats) {
      return `${rooms} ${t('translation:capacity.room', {
        count: rooms,
      })}`;
    } else if (!rooms) {
      return `${seats} ${t('translation:capacity.seat', {
        count: seats,
      })}`;
    } else {
      return `${seats} ${t('translation:capacity.seat', {
        count: seats,
      })}, ${rooms} ${t('translation:capacity.room', {
        count: rooms,
      })}`;
    }
  };

  return (
    <FormField
      control={form.control}
      name="capacity"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'w-full min-w-52 justify-start font-normal',
                    !form.getValues('capacity').seats &&
                      !form.getValues('capacity').rooms &&
                      'text-muted-foreground',
                  )}
                  variant="outline"
                >
                  <UsersRound className="mr-2" size={16} />
                  {popoverTitle()}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      {t('translation:capacity.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('translation:capacity.description')}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="seats">
                        {t('translation:capacity.seat_other')}
                      </Label>
                      <div className="flex">
                        <Button
                          onClick={() =>
                            form.setValue('capacity', {
                              ...field.value,
                              seats: decrement(
                                form.getValues('capacity').seats ?? 0,
                              ),
                            })
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          className="col-span-2 mx-2 h-8 w-10 border-0 px-0 text-center focus-visible:ring-0"
                          id="seats"
                          inputMode="numeric"
                          onChange={(e) =>
                            form.setValue('capacity', {
                              ...field.value,
                              seats: Math.max(
                                0,
                                Math.min(9999, Number(e.target.value)),
                              ),
                            })
                          }
                          type="number"
                          value={form.getValues('capacity').seats}
                        />
                        <Button
                          onClick={() =>
                            form.setValue('capacity', {
                              ...field.value,
                              seats: increment(
                                form.getValues('capacity').seats ?? 0,
                              ),
                            })
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="rooms">
                        {t('translation:capacity.room_other')}
                      </Label>
                      <div className="flex">
                        <Button
                          onClick={() =>
                            form.setValue('capacity', {
                              ...field.value,
                              rooms: decrement(
                                form.getValues('capacity').rooms ?? 0,
                              ),
                            })
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          className="col-span-2 mx-2 h-8 w-10 border-0 px-0 text-center focus-visible:ring-0"
                          id="rooms"
                          inputMode="numeric"
                          onChange={(e) =>
                            form.setValue('capacity', {
                              ...field.value,
                              rooms: Math.max(
                                0,
                                Math.min(9999, Number(e.target.value)),
                              ),
                            })
                          }
                          type="number"
                          value={form.getValues('capacity').rooms}
                        />
                        <Button
                          onClick={() =>
                            form.setValue('capacity', {
                              ...field.value,
                              rooms: increment(
                                form.getValues('capacity').rooms ?? 0,
                              ),
                            })
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
