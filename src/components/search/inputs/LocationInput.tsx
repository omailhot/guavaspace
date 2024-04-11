import { Building } from 'lucide-react';

import { AutocompleteInput } from '@/components/google-map/autocomplete-input/AutocompleteInput';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { SearchFormProps } from '../SearchForm';

type Props = {
  className?: string;
};

export const LocationInput = (
  { form }: SearchFormProps,
  { className }: Props,
) => {
  return (
    <FormField
      control={form.control}
      name="location.address"
      // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
      render={({ field: { ref, ...fieldProps } }) => (
        <FormItem className={cn('w-full', className)}>
          <FormControl>
            <div className="relative">
              <AutocompleteInput
                className={cn('min-w-54 peer w-full pl-10')}
                {...fieldProps}
                onChange={(value) => {
                  form.setValue('location.address', value);
                }}
                onPlaceChanged={(place) => {
                  form.setValue('location.lat', place.geolocation.lat);
                  form.setValue('location.lng', place.geolocation.lng);
                }}
              />
              <Building
                className="absolute left-4 top-3 h-4 w-4 text-foreground peer-placeholder-shown:text-muted-foreground peer-focus:text-foreground"
                size={16}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
