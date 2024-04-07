import './style.css';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../../lib/utils';
import { OfficeAddressType } from '../../../types/Office';
import { Input } from '../../ui/input';

type Address = Pick<
  OfficeAddressType,
  'street1' | 'street2' | 'city' | 'country' | 'province' | 'postalCode'
>;

export type AddressData = {
  shortAddress: Address;
  longAddress: Address;
};

const AddressMapping: Record<keyof Address, string[]> = {
  street1: ['street_number', 'route'],
  street2: [],
  city: ['locality'],
  country: ['country'],
  province: ['administrative_area_level_1'],
  postalCode: ['postal_code'],
};

const getLongNameFromComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[],
  type: string,
) => {
  const component = addressComponents.find((c) => c.types.includes(type));

  return component?.long_name ?? '';
};

const formatAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[],
): AddressData => {
  const keys = Object.keys(AddressMapping) as (keyof Address)[];

  const address = keys.reduce(
    (acc, key) => {
      const types = AddressMapping[key];

      acc.longAddress[key] = types
        .map((type) => {
          const component = addressComponents.find((component) =>
            component.types.includes(type),
          );

          return component?.long_name ?? '';
        })
        .join(' ');

      acc.shortAddress[key] = types
        .map((type) => {
          const component = addressComponents.find((component) =>
            component.types.includes(type),
          );

          return component?.short_name ?? '';
        })
        .join(' ');

      return acc;
    },
    {
      shortAddress: {} as Address,
      longAddress: {} as Address,
    } as AddressData,
  );

  return address;
};

const formatAddressToString = (
  addressComponents: google.maps.GeocoderAddressComponent[],
) => {
  const parts = [
    [
      getLongNameFromComponents(addressComponents, 'street_number'),
      getLongNameFromComponents(addressComponents, 'route'),
    ]
      .filter(Boolean)
      .join(' '),

    getLongNameFromComponents(addressComponents, 'locality'),
    getLongNameFromComponents(addressComponents, 'administrative_area_level_1'),
    getLongNameFromComponents(addressComponents, 'country'),
    getLongNameFromComponents(addressComponents, 'postal_code'),
  ]
    .filter(Boolean)
    .join(', ');

  return parts;
};

export type FormattedPlace = {
  geolocation: {
    lat: number;
    lng: number;
  };
  address: AddressData;
  formattedAddress: string;
};

type Props = {
  className?: string;
  onPlaceChanged?: (place: FormattedPlace) => void;
  onPlaceError?: () => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
  value?: string;
};

const options: google.maps.places.AutocompleteOptions = {
  fields: ['address_components', 'geometry'],
};

export const AutocompleteInput = ({
  className,
  onPlaceChanged,
  onPlaceError,
  onChange,
  onBlur,
  disabled,
  name,
  value,
}: Props) => {
  const [stateValue, setStateValue] = useState(value);

  useEffect(() => {
    setStateValue(value);
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = useCallback(
    (value: string) => {
      setStateValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options,
    );

    const event = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location || !place.address_components) {
        console.error('Place does not have a location or address components');

        onPlaceError?.();

        return;
      }

      const formattedPlace = {
        geolocation: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        address: formatAddressComponents(place.address_components),
        formattedAddress: formatAddressToString(place.address_components),
      };

      setStateValue(formattedPlace.formattedAddress);

      onPlaceChanged?.(formattedPlace);
    });

    return () => {
      window.google.maps.event.removeListener(event);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      className={cn(className)}
      disabled={disabled}
      name={name}
      onBlur={onBlur}
      onChange={(e) => handleOnChange(e.target.value)}
      ref={inputRef}
      value={stateValue}
    />
  );
};
