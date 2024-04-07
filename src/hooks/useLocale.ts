import { enCA, frCA } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export const useLocale = () => {
  const { i18n } = useTranslation();

  switch (i18n.language) {
    case 'fr':
      return frCA;
    default:
      return enCA;
  }
};
