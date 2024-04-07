import { useQuery } from '@tanstack/react-query';
import { array, parse } from 'valibot';

import { api } from '../lib/api';
import { getFullApiPath } from '../lib/path';
import { AmenitySchema } from '../types/Amenity';

export const handleAmenities = async () => {
  const response = await api.get(getFullApiPath(`/amenities`));

  return parse(array(AmenitySchema), response.data);
};

export const useAmenities = () => {
  const mutation = useQuery({
    queryKey: ['amenities'],
    queryFn: () => handleAmenities(),
  });

  return mutation;
};
