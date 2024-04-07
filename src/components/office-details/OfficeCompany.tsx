import { useTranslation } from 'react-i18next';

import { getFullS3Path } from '../../lib/path';
import { cn } from '../../lib/utils';
import { CompanyType } from '../../types/Company';
import { SectionTitle } from './SectionTitle';

type Props = {
  officeCompany: CompanyType;
  className?: string;
};

export const OfficeCompany = ({ officeCompany, className }: Props) => {
  const { t } = useTranslation(['office']);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <SectionTitle>{t('office:company.title')}</SectionTitle>
      <div className="flex w-fit flex-col">
        <div className="flex gap-3">
          <div className="flex items-center justify-center">
            <img
              alt={officeCompany.companyName}
              className="w-20"
              src={getFullS3Path(officeCompany.companyLogoPath)}
            />
          </div>
          <div className="flex flex-col justify-start  gap-2">
            <h2 className="text-2xl font-bold">{officeCompany.companyName}</h2>
            <p className="text-gray-500">{officeCompany.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
