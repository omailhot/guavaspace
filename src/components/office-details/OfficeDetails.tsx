import { OfficeProvider } from '../../contexts/OfficeContext';
import { getFullS3Path } from '../../lib/path';
import { cn } from '../../lib/utils';
import { OfficeDetailsRoute } from '../../routes/offices/details';
import { OfficeEditPreviewRoute } from '../../routes/offices/edit/preview';
import { OfficeType } from '../../types/Office';
import { EditImageType } from '../office-edit/sections/images/OfficeEditImagesSection';
import { OfficeAmenities } from './OfficeAmenities';
import { OfficeCompany } from './OfficeCompany';
import { OfficeDescription } from './OfficeDescription';
import { OfficeDetailsMap } from './OfficeDetailsMap';
import { OfficeImage } from './OfficeImage';
import { OfficePicturesDialog } from './OfficePicturesDialog';
import { RentPanelDesktop } from './rent-panel/RentPanelDesktop';
import { RentPanelMobile } from './rent-panel/RentPanelMobile';

export type OfficeDetailsType = Omit<OfficeType, 'officePictures'> & {
  officePictures: EditImageType[];
};

type Props = {
  office: OfficeDetailsType;
  isEdit?: boolean;
  className?: string;
};

export const getOfficeRoute = (isEdit: boolean) => {
  return isEdit ? OfficeEditPreviewRoute : OfficeDetailsRoute;
};

export const resolveImagePath = (image: EditImageType) => {
  if ('fileData' in image) {
    return URL.createObjectURL(image.fileData);
  }

  return getFullS3Path(image.picturePath);
};

export const OfficeDetails = ({ office, isEdit = false, className }: Props) => {
  const sidePicturesRank = [2, 3, 4, 5];

  return (
    <OfficeProvider isEdit={isEdit} office={office}>
      <div className={cn('relative', className)}>
        <div className={cn('flex flex-col', !isEdit && 'container')}>
          <OfficePicturesDialog />
          <div className="">
            <h1 className="text-3xl font-bold">{office.officeName}</h1>
          </div>
          <div className="mb-10 grid h-[25rem] grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-full">
              <OfficeImage className="h-[25rem] w-full" pictureOrder={1} />
            </div>
            <div className="hidden grid-cols-2 grid-rows-2 gap-3 md:grid">
              {sidePicturesRank.map((rank) => (
                <OfficeImage
                  className="h-48 w-full"
                  key={`office_${office.officeId}_picture_rank_${rank}`}
                  pictureOrder={rank}
                />
              ))}
            </div>
          </div>
          <div className="flex md:flex-col-reverse lg:grid lg:grid-cols-[60%_40%]">
            <div className="flex flex-col divide-y divide-gray-200">
              <OfficeDescription className="pb-10" />
              <OfficeAmenities
                amenities={office.officeAmenities}
                className="py-10"
              />
              {/* <OfficeDetailsCalendar className="py-10" /> */}
              <OfficeDetailsMap className="py-10" />
              <OfficeCompany className="py-10" officeCompany={office.company} />
            </div>
            <div className="flex w-full flex-col items-center">
              <div className="sticky top-10 mb-10 w-full md:mb-0 lg:pl-10">
                <RentPanelDesktop />
              </div>
            </div>
          </div>
        </div>
        <RentPanelMobile />
      </div>
    </OfficeProvider>
  );
};
