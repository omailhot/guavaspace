import { valibotResolver } from '@hookform/resolvers/valibot'; // 1.2 kB
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { email, object, Output, string } from 'valibot'; // 1.2 kB

import { useSubscribeNewsletter } from '@/mutations/useSubscribeNewsletter';

import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { Input } from '../../ui/input';

const EmailSchema = object({
  email: string([email()]),
});

type EmailData = Output<typeof EmailSchema>;

type Props = {
  className?: string;
};

const Newsletter = ({ className }: Props) => {
  const { t } = useTranslation('footer');
  const mutation = useSubscribeNewsletter();

  const form = useForm<EmailData>({
    resolver: valibotResolver(EmailSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit() {
    mutation.mutate({ email: form.getValues().email.trim() });
    form.reset();
  }

  return (
    <div className={cn(className, 'px-6 py-8 md:p-24')}>
      <Card className="p-6 md:px-16 md:py-8">
        <CardHeader className="mb-2 rounded-lg border-none bg-white p-0">
          <CardTitle className="text-foreground">
            {t('footer:newsletter:title')}
          </CardTitle>
          <CardDescription>
            {t('footer:newsletter:description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <Form {...form}>
            <form
              className="md:flex md:space-x-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="peer pl-10"
                          placeholder={t('footer:newsletter:placeholder')}
                          type="email"
                          {...field}
                        />
                        <EnvelopeClosedIcon
                          className={cn(
                            'absolute left-4 top-3 h-4 w-4 text-muted-foreground peer-focus:text-foreground',
                            field.value && 'text-foreground',
                          )}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="mt-4 w-full disabled:text-slate-700 md:mt-0 md:w-auto"
                disabled={!form.formState.isValid}
                type="submit"
                variant={form.formState.isValid ? 'default' : 'secondary'}
              >
                {t('footer:newsletter:submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Newsletter;
