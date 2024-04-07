import { useTranslation } from 'react-i18next';

type Props = {
  onClick: () => void;
};

export const GoogleLoginButton = ({ onClick }: Props) => {
  const { t } = useTranslation(['auth']);

  return (
    <button
      className="flex border border-black items-center hover:bg-gray-100 p-2 w-full rounded-md"
      onClick={onClick}
      type="button"
    >
      <img alt="" src="./logos/Google_Logo.png" width={24} />
      <span className="text-black text-center w-full">
        {t('auth:signup.buttons.oauths.google')}
      </span>
    </button>
  );
};
