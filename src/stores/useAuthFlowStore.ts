import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { StepAlertProps } from '../components/auth/forms/StepAlert';
import { useDialogsStore } from './useDialogsStore';

export const STEP_KEYS = [
  'SIGN_IN',
  'SIGN_UP',
  'EMAIL_CONFIRMATION',
  'CREATE_COMPAGNY',
  'FORGOT_PASSWORD',
  'RESET_PASSWORD',
] as const;

export type StepKeys = (typeof STEP_KEYS)[number];

export const STEP_DICT: Record<StepKeys, string> = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  EMAIL_CONFIRMATION: 'EMAIL_CONFIRMATION',
  CREATE_COMPAGNY: 'CREATE_COMPAGNY',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

export type StepType = {
  key: StepKeys;
  alert?: StepAlertProps;
};

export type AuthFlowState = {
  step: StepType;
  username?: string;
  isCreatedCompany: boolean;
  firstLoginAfterSignup: boolean;
};

export type AuthFlowType = {
  openModal: (
    stepKey: StepKeys,
    options?: { isCreatedCompany?: AuthFlowType['isCreatedCompany'] },
  ) => void;

  setStep: (step: StepType | StepKeys) => void;
  reset: () => void;
  setUsername: (username: string) => void;

  nextStep: (options?: {
    needsToConfirmEmail?: boolean;
    firstLoginAfterSignup?: boolean;
    alert?: StepAlertProps;
    currentStep?: StepKeys;
  }) => void;
} & AuthFlowState;

const DEFAULT_STEP: AuthFlowType['step'] = { key: 'SIGN_IN' };

export const useAuthFlowStore = create<AuthFlowType>()(
  devtools(
    (set) => {
      return {
        step: DEFAULT_STEP,
        isCreatedCompany: false,
        needsToConfirmEmail: false,
        firstLoginAfterSignup: false,

        setStep: (step) => {
          if (typeof step === 'string') {
            set({ step: { key: step } });
            return;
          }

          set({ step });
        },
        reset: () => {
          set({ step: DEFAULT_STEP });
        },
        setUsername: (username) => {
          set({ username });
        },
        openModal: (stepKey, options) => {
          set({
            step: { key: stepKey },
            isCreatedCompany: options?.isCreatedCompany ?? false,
          });

          useDialogsStore.getState().toggleModal('AUTH');
        },
        nextStep: (options) => {
          set((state) => {
            let nextStep: StepKeys | null = null;

            const currentStep = options?.currentStep ?? state.step.key;

            switch (currentStep) {
              case 'FORGOT_PASSWORD':
                nextStep = 'RESET_PASSWORD';
                break;
              case 'RESET_PASSWORD':
                nextStep = 'SIGN_IN';
                break;
              case 'SIGN_IN':
              case 'SIGN_UP':
                if (options?.needsToConfirmEmail) {
                  nextStep = 'EMAIL_CONFIRMATION';
                  break;
                }

                if (state.isCreatedCompany) {
                  nextStep = 'CREATE_COMPAGNY';
                  break;
                }
                break;
              case 'EMAIL_CONFIRMATION':
                nextStep = 'SIGN_IN';
                break;
              case 'CREATE_COMPAGNY':
                break;
            }

            if (options?.currentStep || !nextStep) {
              useDialogsStore.getState().toggleModal('AUTH');
            }

            if (!nextStep) {
              return state;
            }

            return {
              ...state,
              firstLoginAfterSignup: options?.firstLoginAfterSignup ?? false,
              step: { key: nextStep ?? 'SIGN_IN', alert: options?.alert },
            };
          });
        },
      };
    },
    {
      name: 'auth-flow-storage',
    },
  ),
);
