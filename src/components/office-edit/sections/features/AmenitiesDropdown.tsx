import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../../lib/utils';
import { useAmenities } from '../../../../queries/useAmenities';
import type { AmenityType, OfficeAmenityType } from '../../../../types/Amenity';
import { getOfficeAmenityLabelKey } from '../../../office-details/OfficeAmenities';
import { Button } from '../../../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';

type Props = {
  onAmenityChange: (amenity: AmenityType) => void;
  selectedAmenities: OfficeAmenityType[];
  disabled?: boolean;
};

export const AmenitiesDropdown = ({
  onAmenityChange,
  selectedAmenities,
  disabled,
}: Props) => {
  const { t } = useTranslation(['edit_office', 'office']);
  const [open, setOpen] = useState(false);

  const query = useAmenities();

  const amenities = query.data ?? [];

  const loading = query.isPending || query.isLoading;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="justify-between"
          disabled={disabled || loading}
          role="combobox"
          variant="outline"
        >
          {t(
            loading
              ? 'translation:buttons.loading'
              : 'edit_office:edit_panel.features.add',
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            className="h-9"
            placeholder={t('edit_office:edit_panel.features.search')}
          />
          <CommandEmpty>
            {t('edit_office:edit_panel.features.no_features')}
          </CommandEmpty>
          <CommandGroup>
            {amenities.map((amenity) => {
              const { title } = getOfficeAmenityLabelKey(amenity.amenityKey);

              return (
                <CommandItem
                  key={amenity.amenityKey}
                  onSelect={(currentValue) => {
                    const value = currentValue.toLocaleUpperCase();

                    setOpen(false);

                    const amenity = amenities.find(
                      (amenity) => amenity.amenityKey === value,
                    );

                    onAmenityChange(amenity!);
                  }}
                  value={amenity.amenityKey}
                >
                  {t(title)}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',

                      selectedAmenities.some(
                        (selectedAmenity) =>
                          selectedAmenity.amenity.amenityKey ===
                          amenity.amenityKey,
                      )
                        ? 'visible'
                        : 'hidden',
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
