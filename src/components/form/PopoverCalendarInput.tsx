import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { CalendarInput } from './CalendarInput';

type Props = React.ComponentProps<typeof CalendarInput> & {
  disabled?: boolean;
  onBlur?: () => void;
};

export const PopoverCapacityInput = ({
  disabled,
  disabledDates,
  children,
  ...props
}: React.PropsWithChildren<Props>) => {
  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          props.onBlur?.();
        }

        return open;
      }}
    >
      <PopoverTrigger asChild>
        <Button
          className={cn('min-w-52 justify-start font-normal')}
          disabled={disabled}
          variant="outline"
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <CalendarInput {...props} disabledDates={disabledDates} />
      </PopoverContent>
    </Popover>
  );
};
