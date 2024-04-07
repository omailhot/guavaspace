import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';

import { handleCogintoError } from '../../../lib/cognito/Errors';
import { useCreateCompany } from '../../../mutations/useCreateCompany';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { CompanySchema, CompanyType } from '../../../types/Company';
import { SubmitButton } from '../../form/SubmitButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { StepAlert } from './StepAlert';

export const CompanyCreationForm = () => {
  const { t } = useTranslation(['auth']);
  const step = useAuthFlowStore((s) => s.step);

  const mutation = useCreateCompany();

  const form = useForm<CompanyType>({
    resolver: valibotResolver(CompanySchema),
    defaultValues: {
      companyName: '',
    },
  });

  async function onSubmit(values: CompanyType) {
    mutation.mutate(values);
  }

  const isLoading = mutation.isPending;

  const error = mutation.error ? handleCogintoError(mutation.error) : null;

  return (
    <div className="flex flex-col divide-y-2">
      <Form {...form}>
        <form
          className="grid gap-4 pt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {step.alert ? <StepAlert {...step.alert} /> : null}
          {error ? <FormMessage>{t(error.messageKey)}</FormMessage> : null}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('auth:fields.company_name.label')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
};
