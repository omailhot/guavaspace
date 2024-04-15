import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@/components/ui/label';
import { cn, getKeyFromErrorKey, isErrorKey } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './alert';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} ref={ref} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      ref={ref}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      id={formItemId}
      ref={ref}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      id={formDescriptionId}
      ref={ref}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

type Props = {
  errorNamespaces?: string[];
} & React.HTMLAttributes<HTMLParagraphElement>;

const FormMessage = React.forwardRef<HTMLParagraphElement, Props>(
  ({ className, children, errorNamespaces, ...props }, ref) => {
    const { t } = useTranslation(['translation', ...(errorNamespaces ?? [])]);
    const { error, formMessageId } = useFormField();

    let errorMessage = error?.message;

    if (errorMessage && isErrorKey(errorMessage)) {
      errorMessage = t(getKeyFromErrorKey(errorMessage));
    }

    const body = errorMessage ?? children;

    if (!body) {
      return null;
    }

    return (
      <Alert ref={ref} variant="destructive" {...props} className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('translation:errors.defaultTitle')}</AlertTitle>
        <AlertDescription id={formMessageId}>{body}</AlertDescription>
      </Alert>
    );
  },
);
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
