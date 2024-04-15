import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, value, indicatorClassName, ...props }, ref) => {
  const _max = props.max ?? 100;
  const _value = value || 0;

  const transformX = 100 - (_value / _max) * 100;

  return (
    <ProgressPrimitive.Root
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className,
      )}
      ref={ref}
      {...props}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          indicatorClassName,
        )}
        style={{
          transform: `translateX(-${transformX}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
