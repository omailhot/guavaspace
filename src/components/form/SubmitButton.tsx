import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../ui/button';

type Props = {
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const SubmitButton = ({
  isLoading,
  children,
  disabled,
  onClick,
}: PropsWithChildren<Props>) => {
  const { t } = useTranslation();

  const text = children || t('translation:buttons.continue');

  return (
    <Button
      className="w-full"
      disabled={disabled || isLoading}
      onClick={onClick}
      type="submit"
    >
      {isLoading ? t('translation:buttons.loading') : text}
    </Button>
  );
};
