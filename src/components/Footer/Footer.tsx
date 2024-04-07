import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/Contexts/AuthContext';
import { cn } from '@/lib/utils';

import { IndexRoute } from '../../routes/home';
import { Button } from '../ui/button';
import Newsletter from './Newsletter';

type Props = {
  className?: string;
};

export const Footer = ({ className }: Props) => {
  const { startAuthFlow } = useAuthContext();
  const { t, i18n } = useTranslation('footer');

  return (
    <footer className={cn(className, 'mb-20 bg-zinc-50 md:mb-0')}>
      <Newsletter className="mx-auto md:w-11/12" />
      <ul className="mb-8 px-6 text-sm md:flex md:justify-around">
        <li>
          <h3 className="font-semibold">Guavaspace</h3>
          <ul>
            <li className="mt-2">
              <Link
                className="text-md font-normal hover:bg-transparent"
                to={IndexRoute.fullPath}
              >
                {t('footer:home')}
              </Link>
            </li>
          </ul>
        </li>
        <hr className="my-4 md:hidden" />
        <li>
          <h3 className="font-semibold">{t('footer:business')}</h3>
          <ul>
            <li>
              <Button
                className="text-md px-0 font-normal hover:bg-transparent"
                onClick={() => startAuthFlow({ isCreatedCompany: true })}
                variant="ghost"
              >
                {t('footer:listing')}
              </Button>
            </li>
          </ul>
        </li>
        <hr className="my-4 md:hidden" />
        <li>
          <h3 className="font-semibold">{t('footer:support')}</h3>
          <ul>
            <li>
              <Button
                className="text-md p-0 font-normal hover:bg-transparent"
                onClick={() =>
                  i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')
                }
                variant="ghost"
              >
                {t('footer:language')}
              </Button>
            </li>
          </ul>
        </li>
      </ul>
      <hr />
      <span className="flex justify-center py-4">
        © {new Date().getFullYear()} Guavaspace
      </span>
    </footer>
  );
};
