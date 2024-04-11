import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  return (
    <Link
      className={cn('text-2xl font-extrabold text-primary', className)}
      to="/"
    >
      Guavaspace
    </Link>
  );
};
