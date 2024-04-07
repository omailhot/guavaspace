import { valibotResolver } from '@hookform/resolvers/valibot';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import {
  GET_DEFAULT_FROM_DATE,
  GET_DEFAULT_TO_DATE,
  SearchFormSchema,
  SearchFormType,
} from '@/types/Search';

import { OfficesRoute } from '../../../routes/offices';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { Capacity } from './Capacity';
import { DatePickerWithRange } from './DatePickerWithRange';
import { LocationInput } from './LocationInput';

export type SearchFormProps = {
  form: ReturnType<typeof useForm<SearchFormType>>;
};

type Props = {
  className?: string;
  from: string;
  children?: any;
};

export const SearchForm = ({ className, from, children }: Props) => {
  const { t } = useTranslation('search');
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const search = useSearch({ from: from as any });
  const form = useForm<SearchFormType>({
    resolver: valibotResolver(SearchFormSchema),
    defaultValues: {
      location: {
        address: '',
        lat: 0,
        lng: 0,
      },
      dateRange: {
        from: undefined,
        to: undefined,
      },
      capacity: {
        seats: 0,
        rooms: 0,
      },
      ...(search as any),
    },
  });

  const onSubmit = () => {
    setDrawerOpen(false);
    navigate({
      to: OfficesRoute.fullPath,
      search: {
        location: {
          address: form.getValues('location.address'),
          lat: form.getValues('location.lat'),
          lng: form.getValues('location.lng'),
        },
        dateRange: {
          from: form.getValues('dateRange.from') ?? GET_DEFAULT_FROM_DATE(),
          to: form.getValues('dateRange.to') ?? GET_DEFAULT_TO_DATE(),
        },
        capacity: {
          seats: form.getValues('capacity.seats'),
          rooms: form.getValues('capacity.rooms'),
        },
      },
    });
  };

  const clearForm = () => {
    form.setValue('location', {
      address: '',
      lat: 45.508888,
      lng: -73.561668,
    });
    form.setValue('capacity', {
      seats: 0,
      rooms: 0,
    });
    form.setValue('dateRange', {
      from: undefined,
      to: undefined,
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-2', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mx-auto hidden w-full gap-2 md:flex md:flex-row lg:px-0">
          <LocationInput form={form} />
          <DatePickerWithRange form={form} />
          <Capacity form={form} />
          <Button
            className="w-fit"
            disabled={!form.formState.isValid}
            type="submit"
          >
            <Search className="mr-2 w-fit" size={20} />
            {t('search:search')}
          </Button>
        </div>
        <div className="flex md:hidden">
          <Drawer
            direction="bottom"
            onOpenChange={setDrawerOpen}
            open={drawerOpen}
          >
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
              <DrawerClose asChild className="ml-auto">
                <Button variant="link">
                  <XCircle size={28} strokeWidth={1.5} />
                </Button>
              </DrawerClose>
              <DrawerHeader>
                <LocationInput form={form} />
                <DatePickerWithRange form={form} />
                <Capacity form={form} />
              </DrawerHeader>
              <DrawerFooter>
                <div className="flex items-center justify-between">
                  <Button
                    className="px-0"
                    onClick={() => clearForm()}
                    type="reset"
                    variant="link"
                  >
                    {t('search:reset')}
                  </Button>
                  <Button
                    className="w-fit"
                    disabled={!form.formState.isValid}
                    onClick={form.handleSubmit(onSubmit)}
                    type="button"
                  >
                    <Search className="mr-2 w-fit" size={20} />
                    {t('search:search')}
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </form>
    </Form>
  );
};
