import { useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useLocale } from '@/hooks/useLocale';
import { getFullS3Path } from '@/lib/path';
import { DashboardRoute } from '@/routes/dashboard';
import { OfficeDetailsRoute } from '@/routes/offices/details';

import { DataTable } from '../ui/data-table';

export type RentalsTableType = {
  id: string;
  officeId: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  dailyPricePerSeatPaid: number;
  seats: number;
  days: number;
  total: number;
};

type Props = {
  className?: string;
};

export const DashboardRentalsTable = ({ className }: Props) => {
  const data = DashboardRoute.useLoaderData();
  const listData: RentalsTableType[] = [];
  const locale = useLocale();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const handleRowClick = (row: RentalsTableType) => {
    navigate({ to: OfficeDetailsRoute.fullPath, params: { id: row.officeId } });
  };

  const columns: ColumnDef<RentalsTableType>[] = [
    {
      accessorKey: 'title',
      header: () => <div>{t('dashboard:title')}</div>,
    },
    {
      accessorKey: 'image',
      header: () => t('dashboard:image'),
      cell: ({ row }) => {
        return (
          <img
            alt={row.getValue('title')}
            className="h-12 w-12 rounded-sm object-cover"
            src={getFullS3Path(row.original.image)}
          />
        );
      },
    },
    {
      accessorKey: 'dates',
      header: () => <div className="text-center">{t('dashboard:dates')}</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col text-center">
            {row.original.startDate}
            {' - '}
            {row.original.endDate}
          </div>
        );
      },
    },

    {
      accessorKey: 'dailyPricePerSeatPaid',
      header: () => (
        <div className="text-center">
          {t('dashboard:dailyPricePerSeatPaid')}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">{`${row.getValue('dailyPricePerSeatPaid')} CAD$ x ${row.original.seats} ${t('dashboard:seats')} x ${row.original.days} ${t('dashboard:days')}`}</div>
        );
      },
    },
    {
      accessorKey: 'total',
      header: () => t('dashboard:total'),
      cell: ({ row }) => {
        return `${row.getValue('total')} CAD$`;
      },
    },
  ];

  data.forEach((rental) => {
    listData.push({
      id: rental.rentalId,
      officeId: rental.office.officeId,
      title: rental.office.officeName,
      image: rental.office.officePictures[0].picturePath,
      startDate: rental.startDate.toLocaleDateString(locale.code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      endDate: rental.endDate.toLocaleDateString(locale.code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      dailyPricePerSeatPaid: rental.dailyPricePerSeatPaid,
      seats: rental.seats,
      days: differenceInDays(rental.endDate, rental.startDate),
      total: Math.ceil(
        rental.dailyPricePerSeatPaid *
          differenceInDays(rental.endDate, rental.startDate),
      ),
    });
    listData.sort((a, b) => a.startDate.localeCompare(b.startDate));
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
