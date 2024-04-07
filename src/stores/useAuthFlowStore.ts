import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { StepAlertProps } from '../components/Auth/forms/StepAlert';
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
    alert?: StepAlertProps;
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

            switch (state.step.key) {
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

            if (!nextStep) {
              useDialogsStore.getState().toggleModal('AUTH');

              return state;
            }

            return {
              ...state,
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
