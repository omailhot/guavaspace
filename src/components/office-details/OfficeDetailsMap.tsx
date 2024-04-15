import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../lib/utils';
import { useOfficeContext } from '../../contexts/OfficeContext';
import { GoogleMap } from '../google-map/Map';
import { Button } from '../ui/button';
import { SectionTitle } from './SectionTitle';

type Props = {
  className?: string;
};

function generateGoogleMapsDirectionsLink(
  destinationLat: number,
  destinationLong: number,
): string {
  const baseUrl: string = 'https://www.google.com/maps/dir/?api=1';
  const destination: string = `destination=${destinationLat},${destinationLong}`;
  return `${baseUrl}&${destination}`;
}

export const OfficeDetailsMap = ({ className }: Props) => {
  const { officeAddress, officeName } = useOfficeContext().office;
  const { t } = useTranslation(['office']);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <SectionTitle className="flex items-center gap-5">
        <div>{t('office:map.title')}</div>
        <div>
          <Button
            onClick={() => {
              window.open(
                generateGoogleMapsDirectionsLink(
                  officeAddress.latitude,
                  officeAddress.longitude,
                ),
                '_blank',
              );
            }}
            variant="link"
          >
            {t('office:map.itinary')}
            <ExternalLink className="ml-2" size={16} />
          </Button>
        </div>
      </SectionTitle>
      <div className="flex flex-col">
        <GoogleMap
          center={{
            lat: officeAddress.latitude,
            lng: officeAddress.longitude,
          }}
          className="h-96 w-full"
          defaultZoom={15}
        >
          <AdvancedMarker
            position={{
              lat: officeAddress.latitude,
              lng: officeAddress.longitude,
            }}
            title={officeName}
          />
        </GoogleMap>
      </div>
    </div>
  );
};
