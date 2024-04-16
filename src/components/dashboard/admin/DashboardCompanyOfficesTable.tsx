import { Link, useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { FilePenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/ui/data-table';
import { getFullS3Path } from '@/lib/path';
import { DashboardAdminRoute } from '@/routes/dashboard/admin';
import { OfficeDetailsRoute } from '@/routes/offices/details';
import { OfficeEditRoute } from '@/routes/offices/edit';

import { Button } from '../../ui/button';

export type RentalsTableType = {
  id: string;
  title: string;
  image: string;
};

type Props = {
  className?: string;
};

export const DashboardCompanyOfficesTable = ({ className }: Props) => {
  const data = DashboardAdminRoute.useLoaderData();
  const listData: RentalsTableType[] = [];
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const handleRowClick = (row: RentalsTableType) => {
    navigate({ to: OfficeDetailsRoute.fullPath, params: { id: row.id } });
  };

  const columns: ColumnDef<RentalsTableType>[] = [
    {
      accessorKey: 'title',
      header: () => t('dashboard:title'),
    },
    {
      accessorKey: 'image',
      header: () => t('dashboard:image'),
      cell: ({ row }) => {
        if (!row.getValue('image')) {
          return 'N/A';
        }

        return (
          <img
            alt={row.getValue('title')}
            className="h-12 w-12 rounded-sm object-cover"
            src={getFullS3Path(row.getValue('image'))}
          />
        );
      },
    },
    {
      accessorKey: 'action',
      header: () => t('dashboard:edit'),
      cell: ({ row }) => {
        return (
          <Button variant="ghost">
            <Link
              onClick={(e) => e.stopPropagation()}
              params={{ id: row.original.id }}
              to={OfficeEditRoute.fullPath}
            >
              <FilePenLine />
            </Link>
          </Button>
        );
      },
    },
  ];

  data.forEach((office) => {
    listData.push({
      id: office.officeId,
      title: office.officeName,
      image: office.officePictures[0]?.picturePath,
    });
  });
  return (
    <DataTable
      className={className}
      columns={columns}
      data={listData}
      onRowClick={handleRowClick}
    />
  );
};
