import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MapProps {
  lat: number;
  lng: number;
}

export const useFullAddress = ({ lat, lng }: MapProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, async (results, status) => {
      if (!results) {
        return t('translation:errors.invalid_address');
      }

      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    });
  }, [lat, lng, t]);

  return address;
};
