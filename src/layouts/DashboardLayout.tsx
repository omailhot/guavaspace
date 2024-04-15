import { DashboardMobileNavigation } from '@/components/dashboard/navigation/DashboardMobileNavigation';
import { DashboardNavigation } from '@/components/dashboard/navigation/DashboardNavigation';

type Props = {
  children: any;
};

export const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      <DashboardNavigation />
      <div className="container mx-auto">{children}</div>
      <DashboardMobileNavigation />
    </div>
  );
};
