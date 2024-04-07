import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

type PostType = {
  id: string;
  title: string;
  body: string;
};

const fetchPosts = async () => {
  return axios
    .get<PostType[]>('https://jsonplaceholder.typicode.com/posts')
    .then((r) => r.data.slice(0, 10));
};

export const fetchPostsQuery = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
});
