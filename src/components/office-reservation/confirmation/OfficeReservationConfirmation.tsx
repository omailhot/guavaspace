import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/navigation/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { getFullS3Path } from '@/lib/path';
import { getLowestRankPicturePath } from '@/lib/utils';
import { DashboardRoute } from '@/routes/dashboard';
import { OfficeDetailsRoute } from '@/routes/offices/details';
import { OfficeType } from '@/types/Office';

type Props = {
  office: OfficeType;
};

export const OfficeReservationConfirmation = ({ office }: Props) => {
  const { t } = useTranslation('confirmation');
  return (
    <div className="container">
      <div className="hidden p-6 md:flex">
        <Logo />
      </div>
      <Link
        className="text-md my-4 flex items-center text-primary md:text-lg"
        params={{ id: office.officeId }}
        to={OfficeDetailsRoute.fullPath}
      >
        <ChevronLeft />
        <span>{t('confirmation:returnToDetails')}</span>
      </Link>
      <h1 className="text-center text-2xl">{t('confirmation:title')}</h1>
      <Card className="mx-auto mt-4 w-fit overflow-hidden border-none shadow-none">
        <img
          alt={office.officeName}
          className="h-48 rounded-md object-cover"
          src={getFullS3Path(getLowestRankPicturePath(office.officePictures))}
        />
        <CardContent className="flex flex-col p-6 text-center">
          <h5 className="text-md w-full font-medium">{office.officeName}</h5>
          <div className="text-sm text-muted-foreground">
            <p>{`${office.officeAddress.street1}`}</p>
            <p>{`${office.officeAddress.city}, ${office.officeAddress.postalCode}`}</p>
          </div>
          <Link
            className="mt-4 text-primary hover:underline"
            to={DashboardRoute.fullPath}
          >
            {t('confirmation:seeYourReservations')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
