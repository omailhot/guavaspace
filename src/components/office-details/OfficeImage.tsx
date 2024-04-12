import { useState } from 'react';

import { useOfficeContext } from '../../contexts/OfficeContext';
import { cn } from '../../lib/utils';
import { useDialogsStore } from '../../stores/useDialogsStore';
import { OfficePictureType } from '../../types/Picture';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { resolveImagePath } from './OfficeDetails';

type Props = {
  className?: string;
  pictureOrder: OfficePictureType['pictureOrder'];
};

export const OfficeImage = ({ pictureOrder, className }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { office } = useOfficeContext();
  const toggleModal = useDialogsStore((s) => s.toggleModal);

  const picturePath = office.officePictures.find(
    (picture) => picture.pictureOrder === pictureOrder,
  );

  if (!picturePath) {
    // This office doesn't have a picture for this order
    return null;
  }

  const handleOpenModal = () => {
    toggleModal('OFFICE_PICTURES');
  };

  return (
    <div className={cn('relative', className)}>
      {isLoading ? <Skeleton className="h-full w-full" /> : null}
      <img
        className={cn(
          className,
          'rounded-md object-fill',
          isLoading && 'hidden',
        )}
        loading="eager"
        onLoad={() => setIsLoading(false)}
        src={resolveImagePath(picturePath)}
      />
      {pictureOrder === 1 ? (
        <div className="absolute bottom-3 right-3">
          <Button className="mt-3" onClick={handleOpenModal} variant="outline">
            Voir plus
          </Button>
        </div>
      ) : null}
    </div>
  );
};
