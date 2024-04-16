import { useTranslation } from 'react-i18next';

export const Branding = () => {
  const { t } = useTranslation();
  return (
    <div className="my-8 hidden md:block md:w-[450px]">
      <h1 className="text-3xl font-bold text-primary md:text-4xl">
        {t('translation:branding.title')}
      </h1>
      <p className="mt-4">
        {t('translation:branding.description1')}{' '}
        <span className="text-primary">
          {t('translation:branding.description2')}
        </span>{' '}
        {t('translation:branding.description3')}
      </p>
    </div>
  );
};
