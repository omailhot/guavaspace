import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

type Props = {
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link';
  onClick?: () => void;
};

export const SubmitButton = ({
  isLoading,
  children,
  disabled,
  className,
  variant,
  onClick,
}: PropsWithChildren<Props>) => {
  const { t } = useTranslation();

  const text = children || t('translation:buttons.continue');

  return (
    <Button
      className={cn('w-full', className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      type="submit"
      variant={variant || 'default'}
    >
      {isLoading ? t('translation:buttons.loading') : text}
    </Button>
  );
};
