import { Footer } from '@/components/footer/Footer';
import { Navigation } from '@/components/navigation/Navigation';

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
