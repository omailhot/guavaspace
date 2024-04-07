import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const MODAL_KEYS = ['AUTH', 'OFFICE_PICTURES'] as const;

export type ModalKeys = (typeof MODAL_KEYS)[number];

interface BearState {
  modals: Record<ModalKeys, boolean>;
  toggleModal: (key: ModalKeys, forcedState?: boolean) => void;
}

export const useDialogsStore = create<BearState>()(
  devtools(
    (set) => {
      return {
        modals: {
          AUTH: false,
          OFFICE_PICTURES: false,
        },
        toggleModal: (key, forcedState) => {
          set((state) => ({
            modals: {
              ...state.modals,
              [key]: forcedState ?? !state.modals[key],
            },
          }));
        },
      };
    },
    {
      name: 'modals-storage',
    },
  ),
);
