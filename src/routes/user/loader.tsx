import { queryOptions } from '@tanstack/react-query';

import { api } from '../../lib/api';

const fetchPosts = async () => {
  return api.get('/user');
};

export const fetchUserQuery = queryOptions({
  queryKey: ['user'],
  queryFn: () => fetchPosts(),
});
