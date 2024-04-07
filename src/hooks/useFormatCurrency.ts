import { useTranslation } from 'react-i18next';

export const useFormatCurrency = () => {
  const { i18n } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(`ca-${i18n.language.toUpperCase()}`, {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return { formatCurrency };
};
