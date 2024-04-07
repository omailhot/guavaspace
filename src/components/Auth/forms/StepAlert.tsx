import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';

export type StepAlertProps = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

export const StepAlert = ({
  description,
  title,
  variant = 'default',
}: StepAlertProps) => {
  return (
    <Alert variant={variant}>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
