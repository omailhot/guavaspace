import { Link, useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { Globe, LogOut, PlusSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { useAuthContext } from '../../../Contexts/AuthContext';
import { IndexRoute } from '../../../routes/home';
import { CreateOfficeRoute } from '../../../routes/offices/create';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';

type Props = {
  className?: string;
};

export const Navigation = ({ className }: Props) => {
  const { user, signOut, startAuthFlow } = useAuthContext();
  const { i18n } = useTranslation('navigation');
  const navigate = useNavigate();

  return (
    <nav className={cn('hidden h-nav w-full items-center md:flex ', className)}>
      <div className="container mx-auto flex">
        <div className="flex justify-center gap-4">
          <Link
            className="text-2xl font-extrabold text-primary"
            to={IndexRoute.fullPath}
          >
            Guavaspace
          </Link>
        </div>
        <div className="ml-auto flex gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-bold">{user.given_name}</span>
              <Avatar>
                <AvatarImage
                  alt="@shadcn"
                  src="https://github.com/olivier-deschenes.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          ) : null}
          <div className="ml-auto flex gap-2">
            <Button
              className="gap-2"
              onClick={() =>
                navigate({
                  to: CreateOfficeRoute.fullPath,
                })
              }
              variant="outline"
            >
              <PlusSquare size={18} />
              {t('navigation:listing')}
            </Button>
            {user ? (
              <Button
                className="gap-1"
                onClick={() => signOut()}
                variant="ghost"
              >
                <LogOut size={16} />
                {t('navigation:logout')}
              </Button>
            ) : (
              <Button onClick={() => startAuthFlow()} variant="outline">
                {t('navigation:login')}
              </Button>
            )}
            <Button
              className="flex w-12 items-center gap-1 rounded-md"
              onClick={() =>
                i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')
              }
              size="icon"
              variant="ghost"
            >
              <Globe size={16} />
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
