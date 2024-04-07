import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, PlusCircle, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { intersect, object, Output, pick, string } from 'valibot';

import { getFullS3Path } from '../../../../lib/path';
import { useCreatePicture } from '../../../../mutations/pictures/useCreatePicture';
import { useDeletePicture } from '../../../../mutations/pictures/useDeletePicture';
import { useReorderPicture } from '../../../../mutations/pictures/useReorderPicture';
import { fetchOfficeDetailsQuery } from '../../../../routes/offices/details/loader';
import { OfficeEditImagesRoute } from '../../../../routes/offices/edit/preview/sections/Images';
import { OfficeAddressSchema, OfficeSchema } from '../../../../types/Office';
import { OfficePictureType } from '../../../../types/Picture';
import { Button } from '../../../ui/button';
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../ui/card';
import { Input } from '../../../ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';

export type EditImageType =
  | {
      id: string;
      fileData: File;
      pictureOrder: number;
    }
  | OfficePictureType;

const OfficeDescriptionSchema = intersect([
  OfficeAddressSchema,
  pick(OfficeSchema, ['officeName']),
  object({
    address: string(),
  }),
]);

export type OfficeDescriptionType = Output<typeof OfficeDescriptionSchema>;

export const OfficeEditImagesSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation(['edit_office', 'office']);

  const m_reorderPicture = useReorderPicture();
  const m_createPicture = useCreatePicture();
  const m_deletePicture = useDeletePicture();

  const officeId = OfficeEditImagesRoute.useParams().id;

  const officeQuery = useSuspenseQuery(
    fetchOfficeDetailsQuery({ officeId: officeId }),
  );

  const onLabelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const office = officeQuery.data;

  const isLoading =
    m_reorderPicture.isPending ||
    m_createPicture.isPending ||
    m_deletePicture.isPending;

  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    Promise.all(
      files.map((file) => {
        return m_createPicture.mutateAsync({
          officeId: officeId,
          file: file,
        });
      }),
    );
  };

  const onOrderChange = (picture: OfficePictureType, delta: number) => {
    const index = office.officePictures.findIndex(
      (p) => p.officePictureId === picture.officePictureId,
    );

    m_reorderPicture.mutate({
      officeId: officeId,
      officePictureId: picture.officePictureId,
      pictureOrder: index + 1 + delta,
    });
  };

  const onRemove = (picture: OfficePictureType) => {
    m_deletePicture.mutate({
      officeId: officeId,
      officePictureId: picture.officePictureId,
    });
  };

  return (
    <Card className="w-full">
      <CardContent>
        <CardHeader>
          <CardTitle>{t('edit_office:edit_panel.images.title')}</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <div>
            <div
              className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary py-8"
              onClick={(e) => onLabelClick(e)}
            >
              <label
                className="flex cursor-pointer gap-2 text-primary"
                htmlFor="office-picture-input"
              >
                {t('edit_office:edit_panel.images.table.add')}
                <PlusCircle />
              </label>
            </div>
            <Input
              accept={'image/*'}
              className="hidden opacity-0"
              id="office-picture-input"
              multiple={true}
              onChange={handleOnFileChange}
              ref={inputRef}
              type="file"
            />
          </div>
          <div>
            <Table isLoading={isLoading}>
              <TableCaption>
                {t('edit_office:edit_panel.images.table.caption')}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t('edit_office:edit_panel.images.table.columns.image')}
                  </TableHead>
                  <TableHead>
                    {t(
                      'edit_office:edit_panel.images.table.columns.change_order',
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {office.officePictures.map((picture, index) => {
                  const isFirst = index === 0;
                  const isLast = index === office.officePictures.length - 1;

                  return (
                    <TableRow key={picture.officePictureId}>
                      <TableCell className="font-medium">
                        <img
                          alt=""
                          className="w-32"
                          src={getFullS3Path(picture.picturePath)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Button
                            disabled={isFirst || isLoading}
                            onClick={() => onOrderChange(picture, -1)}
                            variant="ghost"
                          >
                            <ChevronUp />
                          </Button>
                          <Button
                            disabled={isLast || isLoading}
                            onClick={() => onOrderChange(picture, 1)}
                            variant="ghost"
                          >
                            <ChevronDown />
                          </Button>
                          <Button
                            className="hover:text-red-600"
                            disabled={isLoading}
                            onClick={() => onRemove(picture)}
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
          </div>
        </CardBody>
      </CardContent>
    </Card>
  );
};
