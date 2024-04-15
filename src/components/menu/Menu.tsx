import { Link, LinkProps, RegisteredRouter } from '@tanstack/react-router';

import { cn } from '../../lib/utils';
import { Card, CardBody, CardContent, CardHeader, CardTitle } from '../ui/card';

type SubNavProps = LinkProps<RegisteredRouter['routeTree']> & {
  icon: React.ReactNode;
  text: string;
};

export const SubNav = ({ className, icon, text, ...props }: SubNavProps) => {
  return (
    <Link
      className={cn(
        className,
        'flex flex-col items-center justify-start gap-3 rounded-md px-3 py-1.5 lg:flex-row [&.active]:bg-primary [&.active]:text-white',
      )}
      {...props}
    >
      <div>{icon}</div>
      <div className="text-xs md:text-base">{text}</div>
    </Link>
  );
};

type MenuProps = {
  title: string;
};

export const Menu = ({
  children,
  title,
}: React.PropsWithChildren<MenuProps>) => {
  return (
    <div className="flex flex-col p-0 pb-5 lg:items-center lg:p-5">
      <Card className="flex w-full flex-col">
        <CardContent className="p-0">
          <CardHeader className="border-b">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-row justify-center gap-1.5 p-0 md:p-1.5 lg:flex-col">
            {children}
          </CardBody>
        </CardContent>
      </Card>
    </div>
  );
};
