import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = React.HTMLProps<HTMLHeadingElement>;

export const SectionTitle = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<Props>) => {
  return (
    <h3
      className={twMerge('text-3xl font-semibold mb-5', className)}
      {...props}
    >
      {children}
    </h3>
  );
};
