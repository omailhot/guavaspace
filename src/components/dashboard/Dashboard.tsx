import { cn } from '@/lib/utils';

import { DashboardRentalsTable } from './DashboardRentalsTable';

type Props = {
  className?: string;
};

export const Dashboard = ({ className }: Props) => {
  return (
    <div className={cn('container mx-auto', className)}>
      <h1 className="my-8 text-xl font-medium">Mes locations</h1>
      <DashboardRentalsTable />
    </div>
  );
};
