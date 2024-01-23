import { Link } from '@tanstack/react-router';

export const Navigation = () => {
  return (
    <nav className="bg-slate-100 w-full p-4 gap-4 flex">
      <Link className="[&.active]:font-bold" to="/">
        Home
      </Link>{' '}
      <Link className="[&.active]:font-bold" to="/about">
        About
      </Link>
      <Link
        className="[&.active]:font-bold"
        params={{ id: '10' }}
        to="/posts/$id"
      >
        Posts
      </Link>
    </nav>
  );
};
