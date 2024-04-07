import { PropsWithChildren } from 'react';

import { cn } from '../lib/utils';
import { Skeleton } from './ui/skeleton';

type Props = {
  isLoading: boolean;
  className?: string;
};

export const SmartSkeleton = ({
  isLoading,
  className,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className={cn(className)}>
      {isLoading ? <Skeleton className="w-full h-full" /> : children}
    </div>
  );
};
