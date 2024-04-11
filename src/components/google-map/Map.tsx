import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  defaultZoom?: number;
};

export const GoogleMap = ({
  className,
  center,
  zoom,
  children,
  defaultZoom = 12,
}: React.PropsWithChildren<Props>) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={API_KEY}>
      <div className={cn(className, '')}>
        <Map
          className="h-full w-full rounded-md md:rounded-r-none"
          defaultCenter={center || { lat: 45.508888, lng: -73.561668 }}
          defaultZoom={defaultZoom}
          disableDefaultUI={true}
          gestureHandling="greedy"
          mapId="b1b1b1b1b1b1b1b1"
          zoom={zoom}
        >
          {children}
        </Map>
      </div>
    </APIProvider>
  );
};
