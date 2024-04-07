import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useOfficeContext } from '../../Contexts/OfficeContext';
import { cn } from '../../lib/utils';
import { GlobalDialog } from '../GlobalDialog';
import { resolveImagePath } from './OfficeDetails';

export const OfficePicturesDialog = () => {
  const { office } = useOfficeContext();

  return (
    <GlobalDialog id="OFFICE_PICTURES">
      <DialogContent
        className="min-w-screen flex max-h-none min-h-screen max-w-none flex-col overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Office Pictures</DialogTitle>
        </DialogHeader>
        <DialogBody className="container grid max-h-[calc(100dvh-3rem)] grid-cols-1 gap-3 overflow-auto md:grid-cols-2">
          {office.officePictures.map((image) => {
            return (
              <div
                className={cn(
                  'col-span-1 row-span-1 h-full w-full rounded-md object-scale-down',
                )}
                key={`office-picture-dialog-${image.pictureOrder}`}
              >
                <img
                  alt={office.officeName}
                  loading="eager"
                  src={resolveImagePath(image)}
                />
              </div>
            );
          })}
        </DialogBody>
      </DialogContent>
    </GlobalDialog>
  );
};
