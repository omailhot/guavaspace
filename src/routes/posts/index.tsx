import { useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '@tanstack/react-router';

import { Button } from '../../components/ui/button';
import { BaseRoute } from '../base';
import { fetchPostsQuery } from './loader';

const Component = () => {
  const { id } = PostsRoute.useParams();

  const postsQuery = useSuspenseQuery(fetchPostsQuery);

  const { data, isLoading, isError } = postsQuery;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div>
      {postsQuery.isFetching ? <div>Fetching...</div> : null}
      <h1>
        Post ID: <code>{id}</code>
      </h1>
      <Button onClick={() => postsQuery.refetch()}>Refetch</Button>
      <div>
        <h2>Posts</h2>
        <ul className="flex flex-col gap-2 m-2">
          {data.map((post) => (
            <li className="bg-slate-100 p-2" key={post.id}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PostsRoute = new Route({
  getParentRoute: () => BaseRoute,
  component: Component,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(fetchPostsQuery),
  path: '/posts/$id',
});
