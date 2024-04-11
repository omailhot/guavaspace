import { Globe, PlusSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Navbar } from '@/components/ui/navbar';
import { useAuthContext } from '@/contexts/AuthContext';
import i18n from '@/i18n';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Logo } from './Logo';
import { ProfileDropdown } from './ProfileDropdown';

type Props = {
  className?: string;
};

export const Navigation = ({ className }: Props) => {
  const { t } = useTranslation('navigation');
  const { user, startAuthFlow } = useAuthContext();

  return (
    <Navbar className={cn(className)}>
      <div className="container mx-auto flex items-center">
        <Logo />
        {user ? (
          <ProfileDropdown />
        ) : (
          <div className="ml-auto flex gap-2">
            <Button
              className="gap-2"
              onClick={() => startAuthFlow({ isCreatedCompany: true })}
              variant="outline"
            >
              <PlusSquare size={18} />
              {t('navigation:create-rental')}
            </Button>
            <Button onClick={() => startAuthFlow()} variant="outline">
              {t('navigation:login')}
            </Button>
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
        )}
      </div>
    </Navbar>
  );
};
