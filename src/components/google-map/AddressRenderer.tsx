import React from 'react';

import { useFullAddress } from '../../hooks/useFullAddress';
import { Skeleton } from '../ui/skeleton';

// Define props interface
interface MapProps {
  lat: number;
  lng: number;
}

const AddressRenderer: React.FC<MapProps> = ({ lat, lng }) => {
  const address = useFullAddress({ lat, lng });

  if (!address) {
    return <Skeleton className="h-[1em] w-full" />;
  }

  return <div>{address}</div>;
};

export default AddressRenderer;
