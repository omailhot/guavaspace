import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getFullS3Path } from '@/lib/path';
import { cn } from '@/lib/utils';
import { RentalPreviewType } from '@/types/RentalPreviews';

import { OfficeDetailsRoute } from '../../routes/offices/details';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

type Props = {
  className?: string;
  rentalPreviews: RentalPreviewType[];
};

export const Listing = ({ className, rentalPreviews }: Props) => {
  const [loadingIndex, setLoadingIndex] = useState<number>(0);

  const { t } = useTranslation('listing');

  useEffect(() => {
    const loadNextOffice = async () => {
      await new Promise<null>((resolve) => {
        if (loadingIndex === 0) {
          setTimeout(resolve, 250);
          return;
        }

        resolve(null);
      });
      if (loadingIndex < rentalPreviews.length) {
        setLoadingIndex((prev) => prev + 1);
      }
    };

    loadNextOffice();
  }, [loadingIndex, rentalPreviews.length]);

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 justify-center gap-6 sm:grid-cols-2',
        className,
      )}
    >
      {rentalPreviews.map((rentalPreview, index) => {
        const isLoading = index > loadingIndex;
        const lowestRankPicturePath =
          rentalPreview.office.officePictures.reduce((prev, current) => {
            return prev.pictureOrder < current.pictureOrder ? prev : current;
          }).picturePath;

        return (
          <div className="relative" key={rentalPreview.office.officeId}>
            <Link
              className={cn('rounded-md ', isLoading ? 'opacity-0' : '')}
              params={{ id: rentalPreview.office.officeId }}
              preload="intent"
              to={OfficeDetailsRoute.fullPath}
            >
              <Card className="w-full overflow-hidden border-0 bg-transparent shadow-none">
                <div>
                  <img
                    alt={rentalPreview.office.officeName}
                    className="h-48 w-full rounded-md object-cover"
                    loading={loadingIndex === 0 ? 'eager' : 'lazy'}
                    src={getFullS3Path(lowestRankPicturePath)}
                  />
                  <CardContent className="p-0">
                    <h5 className="text-md pt-2 font-medium">
                      {rentalPreview.office.officeName}
                    </h5>
                    <p className="text-gray-500">
                      {rentalPreview.office.officeAddress.city}
                    </p>
                    <div className="text-md font-light text-zinc-500">
                      <p>
                        <span className="font-semibold text-primary">
                          {rentalPreview.seatsAvailable}
                        </span>{' '}
                        {t('listing:seat', {
                          count: rentalPreview.seatsAvailable,
                        })}
                      </p>
                      <p>
                        {t('listing:from')}{' '}
                        <span className="font-semibold text-primary">
                          {rentalPreview.avgDailyPricePerSeat}$ CAD
                        </span>
                        {t('listing:perSeat')}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
            {isLoading ? (
              <Card
                className={cn(
                  'absolute left-0 top-0 z-10 w-full overflow-hidden border-0 bg-transparent shadow-none',
                )}
                key={index}
              >
                <div>
                  <Skeleton className="h-48 w-full rounded-md" />
                  <CardContent className="p-0">
                    <Skeleton className="mt-2 h-6 w-48" />
                    <Skeleton className="mt-2 h-4 w-32" />
                    <Skeleton className="mt-2 h-4 w-40" />
                    <Skeleton className="mt-2 h-4 w-40" />
                  </CardContent>
                </div>
              </Card>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
