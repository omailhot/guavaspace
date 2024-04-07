import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';

import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { StepKeys, useAuthFlowStore } from '../../stores/useAuthFlowStore';
import { GlobalDialog } from '../GlobalDialog';
import { CompanyCreationForm } from './forms/CompanyCreationForm';
import { ConfirmEmailForm } from './forms/ConfirmEmailForm';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm';
import { ResetPasswordForm } from './forms/ResetPasswordForm';
import { SignInForm } from './forms/SignInForm';
import { SignUpForm } from './forms/SignUpForm';

export const EmailSchema = v.object({
  email: v.string([v.email()]),
});

export type EmailType = v.Output<typeof EmailSchema>;

const getFormHeaderKey = (step: StepKeys) => {
  switch (step) {
    case 'SIGN_IN':
      return 'auth:login.title';
    case 'SIGN_UP':
      return 'auth:signup.title';
    case 'EMAIL_CONFIRMATION':
      return 'auth:email_confirmation.title';
    case 'CREATE_COMPAGNY':
      return 'auth:create_company.title';
    case 'FORGOT_PASSWORD':
      return 'auth:forgot_password.title';
    case 'RESET_PASSWORD':
      return 'auth:reset_password.title';
  }
};

export const AuthModal = () => {
  const { t } = useTranslation(['auth']);

  const step = useAuthFlowStore((s) => s.step);

  const formBody = useMemo(() => {
    switch (step.key) {
      case 'SIGN_IN':
        return <SignInForm />;
      case 'SIGN_UP':
        return <SignUpForm />;
      case 'EMAIL_CONFIRMATION':
        return <ConfirmEmailForm />;
      case 'CREATE_COMPAGNY':
        return <CompanyCreationForm />;
      case 'FORGOT_PASSWORD':
        return <ForgotPasswordForm />;
      case 'RESET_PASSWORD':
        return <ResetPasswordForm />;
    }
  }, [step]);

  return (
    <GlobalDialog id="AUTH">
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t(getFormHeaderKey(step.key))}</DialogTitle>
        </DialogHeader>
        <DialogBody>{formBody}</DialogBody>
      </DialogContent>
    </GlobalDialog>
  );
};
