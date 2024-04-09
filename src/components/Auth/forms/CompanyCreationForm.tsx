import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';

import { useAuthContext } from '../../../Contexts/AuthContext';
import { useCreateCompany } from '../../../mutations/useCreateCompany';
import { useAuthFlowStore } from '../../../stores/useAuthFlowStore';
import { SubmitButton } from '../../form/SubmitButton';

export const CompanyCreationForm = () => {
  const { t } = useTranslation(['auth']);
  const [officeName, setOfficeName] = useState('');
  const [officeLogoFile, setOfficeLogoFile] = useState<File>();
  const { nextStep } = useAuthFlowStore();
  const { resetSession } = useAuthContext();

  const mutation = useCreateCompany();

  async function onSubmit() {
    if (!officeLogoFile) {
      return;
    }

    mutation
      .mutateAsync({
        companyName: officeName,
        file: officeLogoFile,
        companyLogoContentType: officeLogoFile?.type,
      })
      .then(() => {
        nextStep();
        resetSession();
      })
      .catch(() => {
        mutation.reset();
      });
  }

  const isLoading = mutation.isPending;

  const disabled = mutation.error || !officeName || !officeLogoFile;

  return (
    <div className="flex flex-col gap-5 divide-y-2">
      <div className="grid gap-4 pt-4">
        <div className="flex flex-col">
          <div>{t('auth:fields.company_name.label')}</div>
          <Input
            onChange={(e) => {
              setOfficeName(e.target.value);
            }}
            value={officeName}
          />
        </div>
        <div className="flex flex-col">
          <div>{t('auth:fields.company_name.label')}</div>
          <Input
            accept={'image/*'}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setOfficeLogoFile(file);
              }
            }}
            type="file"
          />
        </div>
      </div>
      <SubmitButton
        disabled={disabled}
        isLoading={isLoading}
        onClick={onSubmit}
      />
    </div>
  );
};
