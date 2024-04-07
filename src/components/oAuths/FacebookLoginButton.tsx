import { useTranslation } from 'react-i18next';

type Props = {
  onClick: () => void;
};

export const FacebookLoginButton = ({ onClick }: Props) => {
  const { t } = useTranslation(['auth']);

  return (
    <button
      className="bg-[#1A77F2] hover:bg-[#1A77F2]/90 flex  items-center p-2  w-full rounded-md"
      onClick={onClick}
      type="button"
    >
      <img alt="" src="./logos/Facebook_Logo_Secondary.png" width={24} />
      <span className="text-white text-center w-full">
        {t('auth:signup.buttons.oauths.facebook')}
      </span>
    </button>
  );
};
