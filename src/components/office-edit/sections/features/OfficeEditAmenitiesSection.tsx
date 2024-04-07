import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAddAmenity } from '../../../../mutations/amenity/useAddAmenity';
import { useDeleteAmenity } from '../../../../mutations/amenity/useDeleteAmenity';
import { useReorderAmenity } from '../../../../mutations/amenity/useReorderAmenity';
import { fetchOfficeDetailsQuery } from '../../../../routes/offices/details/loader';
import { OfficeEditAmenitiesRoute } from '../../../../routes/offices/edit/preview/sections/Amenities';
import { AmenityType, OfficeAmenityType } from '../../../../types/Amenity';
import { getOfficeAmenityLabelKey } from '../../../office-details/OfficeAmenities';
import { Button } from '../../../ui/button';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';
import { AmenitiesDropdown } from './AmenitiesDropdown';

type Props = {
  id?: string;
};

export const OfficeEditAmenitiesSection = ({ id }: Props) => {
  const { t } = useTranslation(['edit_office']);

  const m_reorderAmenity = useReorderAmenity();
  const m_addAmenity = useAddAmenity();
  const m_deleteAmenity = useDeleteAmenity();

  const officeId = OfficeEditAmenitiesRoute.useParams().id;

  const officeQuery = useSuspenseQuery(
    fetchOfficeDetailsQuery({ officeId: officeId }),
  );

  const office = officeQuery.data;

  const [selectedAmenities, setSelectedAmenities] = useState<
    OfficeAmenityType[]
  >([]);

  useEffect(() => {
    setSelectedAmenities(office.officeAmenities);
  }, [office.officeAmenities]);

  const handleOnAmenityChange = (amenity: AmenityType) => {
    const _amenity = selectedAmenities.find(
      (a) => a.amenity.amenityId === amenity.amenityId,
    );

    if (_amenity) {
      handleOnAmenityDelete(_amenity);
    } else handleOnAmenityAdd(amenity);
  };
  const handleOnAmenityDelete = (amenity: OfficeAmenityType) => {
    m_deleteAmenity.mutate({
      amenityId: amenity.amenity.amenityId,
      officeId: officeId,
    });
  };

  const handleOnAmenityAdd = (amenity: AmenityType) => {
    m_addAmenity.mutate({
      amenityId: amenity.amenityId,
      officeId: officeId,
    });
  };

  const handleAmenityOrderChange = (
    amenity: OfficeAmenityType,
    delta: number,
  ) => {
    const amenityIndex = selectedAmenities.findIndex(
      (a) => a.amenity.amenityId === amenity.amenity.amenityId,
    );

    m_reorderAmenity.mutate({
      amenityId: amenity.amenity.amenityId,
      amenityOrder: amenityIndex + 1 + delta,
      officeId: officeId,
    });
  };

  const handleOnMoveUp = (amenity: OfficeAmenityType) => {
    handleAmenityOrderChange(amenity, -1);
  };

  const handleOnMoveDown = (amenity: OfficeAmenityType) => {
    handleAmenityOrderChange(amenity, 1);
  };
  const isLoading =
    m_reorderAmenity.isPending ||
    m_addAmenity.isPending ||
    m_deleteAmenity.isPending;

  return (
    <Card className="w-full" id={id}>
      <CardContent>
        <CardHeader>
          <CardTitle>{t('edit_office:edit_panel.features.title')}</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <AmenitiesDropdown
            disabled={isLoading || !office}
            onAmenityChange={handleOnAmenityChange}
            selectedAmenities={selectedAmenities}
          />
          <Table isLoading={isLoading}>
            <TableCaption>
              {t('edit_office:edit_panel.features.table.caption')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t('edit_office:edit_panel.features.table.columns.name')}
                </TableHead>
                <TableHead>
                  {t(
                    'edit_office:edit_panel.features.table.columns.change_order',
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedAmenities.map((amenity, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedAmenities.length - 1;

                const { title } = getOfficeAmenityLabelKey(
                  amenity.amenity.amenityKey,
                );

                return (
                  <TableRow key={amenity.amenity.amenityId}>
                    <TableCell className="font-medium">{t(title)}</TableCell>
                    <TableCell>
                      <div>
                        <Button
                          disabled={isFirst || isLoading}
                          onClick={() => handleOnMoveUp(amenity)}
                          variant="ghost"
                        >
                          <ChevronUp />
                        </Button>
                        <Button
                          disabled={isLast || isLoading}
                          onClick={() => handleOnMoveDown(amenity)}
                          variant="ghost"
                        >
                          <ChevronDown />
                        </Button>
                        <Button
                          className="hover:text-red-600"
                          disabled={isLoading}
                          onClick={() => handleOnAmenityDelete(amenity)}
                          variant="ghost"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </CardContent>
    </Card>
  );
};
