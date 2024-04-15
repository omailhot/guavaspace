import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { object, parse, string } from 'valibot';

import { api } from '../lib/api';
import { handleCogintoError } from '../lib/cognito/Errors';
import { getFullApiPath } from '../lib/path';
import { CompanySchema } from '../types/Company';

export type CreateCompanyData = {
  companyName: string;
  companyLogoContentType: string;
  file: File;
};

export const CreateCompanyResponseSchema = object({
  company: CompanySchema,
  companyLogoUploadUrl: string(),
});

const handleCreateCompany = async (data: CreateCompanyData) => {
  const response = await api.post(getFullApiPath('/companies'), {
    companyName: data.companyName,
    companyLogoContentType: data.companyLogoContentType,
  });

  const parsedResponse = parse(CreateCompanyResponseSchema, response.data);

  try {
    await axios.put(parsedResponse.companyLogoUploadUrl, data.file, {
      headers: {
        'Content-Type': `${data.file.type}`,
      },
    });
  } catch (error) {
    console.error(error);

    throw error;
  }

  return parsedResponse;
};

export const useCreateCompany = () => {
  const { t } = useTranslation(['auth']);

  const mutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: handleCreateCompany,
    onError: (error: any) => {
      const parsedError = handleCogintoError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success(t('auth:email_confirmation.success.title'), {
        description: t('auth:email_confirmation.success.description'),
      });
    },
  });

  return mutation;
};
