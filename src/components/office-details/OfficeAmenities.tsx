import {
  ChevronDown,
  ChevronUp,
  Computer,
  LucideProps,
  ParkingCircle,
  Wifi,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AmenityType, OfficeAmenityType } from '../../types/Amenity';
import { Button } from '../ui/button';
import { SectionTitle } from './SectionTitle';

type OfficeAmenitiesProps = {
  amenities: OfficeAmenityType[];
  className?: string;
};

const MAX_AMENITIES_SHOWN = 3;

export const OfficeAmenities = ({
  amenities,
  className,
}: OfficeAmenitiesProps) => {
  const [showMore, setShowMore] = useState(false);

  const { t } = useTranslation(['office']);

  const hasMoreThanMax = amenities.length > MAX_AMENITIES_SHOWN;

  const _amenities = useMemo(() => {
    return showMore ? amenities : amenities.slice(0, MAX_AMENITIES_SHOWN);
  }, [amenities, showMore]);

  const handleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const labelKey = showMore ? 'show_less' : 'show_more';

  return (
    <div className={className}>
      <SectionTitle className="flex gap-10">
        <div>{t('office:features.title')}</div>
      </SectionTitle>
      <ul className="flex flex-col">
        {_amenities.map((feature) => (
          <OfficeAmenity
            key={feature.amenity.amenityKey}
            officeAmenity={feature}
          />
        ))}
      </ul>
      {hasMoreThanMax ? (
        <div className="flex items-center justify-center">
          <Button onClick={handleShowMore} variant="ghost">
            {showMore ? <ChevronUp /> : <ChevronDown />}
            <span className="ml-2.5">
              {t(`office:features.${labelKey}`, {
                count: amenities.length - MAX_AMENITIES_SHOWN,
              })}
            </span>
          </Button>
        </div>
      ) : null}
    </div>
  );
};

type OfficeAmenityProps = {
  officeAmenity: OfficeAmenityType;
};

type OfficeAmenityIconProps = LucideProps & {
  officeAmenityKey: OfficeAmenityType['amenity']['amenityKey'];
};

export const OfficeAmenityIcon = ({
  officeAmenityKey,
  ...props
}: OfficeAmenityIconProps) => {
  let icon = null;

  switch (officeAmenityKey) {
    case 'WIFI':
      icon = <Wifi {...props} />;

      break;
    case 'FREE_PARKING':
    case 'PARKING':
      icon = <ParkingCircle {...props} />;

      break;
    case 'COMPUTER':
      icon = <Computer {...props} />;
      break;
  }

  return icon;
};

export const getOfficeAmenityLabelKey = (
  amenityKey: AmenityType['amenityKey'],
) => {
  return {
    title: `office:features.${amenityKey}.title`,
    description: `office:features.${amenityKey}.description`,
  };
};

export const OfficeAmenity = ({ officeAmenity }: OfficeAmenityProps) => {
  const { t } = useTranslation(['office']);

  const { title, description } = getOfficeAmenityLabelKey(
    officeAmenity.amenity.amenityKey,
  );

  return (
    <div className="group flex gap-10 p-5">
      <div className="flex items-center justify-center">
        <OfficeAmenityIcon
          officeAmenityKey={officeAmenity.amenity.amenityKey}
          size={40}
        />
      </div>
      <div className="flex flex-col">
        <div className="font-bold">{t(title)}</div>
        <div className="text-gray-600">{t(description)}</div>
      </div>
    </div>
  );
};
