import { cn } from '@/lib/utils';

import { Logo } from '../navigation/Logo';

type Props = {
  children: any;
  className?: string;
};

export const Navbar = ({ children, className }: Props) => {
  return (
    <>
      <div className="flex justify-center my-4 md:hidden">
        <Logo />
      </div>
      <nav
        className={cn(
          'sticky top-0 z-50 hidden h-nav w-full items-center border-b bg-white shadow-sm md:flex',
          className,
        )}
      >
        {children}
      </nav>
    </>
  );
};
