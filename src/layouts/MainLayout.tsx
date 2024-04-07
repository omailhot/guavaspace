import { Footer } from '@/components/Footer/Footer';
import { Navigation } from '@/components/header/Navigation/Navigation';

type Props = {
  children: any;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      <Navigation className="sticky top-0 z-50 bg-white" />
      {children}
      <Footer />
    </div>
  );
};
