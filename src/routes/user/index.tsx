import { useSuspenseQuery } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';
import * as v from 'valibot';

import { Button } from '../../components/ui/button';
import { BaseRoute } from '../base';
import { fetchUserQuery } from './loader';

const Component = () => {
  const postsQuery = useSuspenseQuery(fetchUserQuery);

  const { isLoading, isError } = postsQuery;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div>
      {postsQuery.isFetching ? <div>Fetching...</div> : null}
      <Button onClick={() => postsQuery.refetch()}>Refetch</Button>
      <div>
        <h2>User</h2>
      </div>
    </div>
  );
};

const PostsParamsSchema = v.object({
  id: v.optional(v.number()),
});

export const UserRoute = createRoute({
  getParentRoute: () => BaseRoute,
  component: Component,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(fetchUserQuery),
  path: '/user',
  validateSearch: (search) => v.parse(PostsParamsSchema, search),
});
