import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { OfficeDetailsType } from '../components/office-details/OfficeDetails';

type Mode = 'EDIT' | 'CREATE';

interface OfficeEditState {
  mode: Mode;
  office: OfficeDetailsType;
  isInitialized: boolean;

  init: (mode: Mode, defaultOffice: OfficeDetailsType) => void;
  updateOffice: (office: OfficeDetailsType) => void;
}

export const useOfficeEditStore = create<OfficeEditState>()(
  devtools(
    (set) => {
      return {
        mode: 'EDIT',
        // TODO : Change this for a default office
        office: {} as OfficeDetailsType,
        isInitialized: false,

        init: (mode, defaultOffice) => {
          set({ mode, office: defaultOffice, isInitialized: true });
        },
        updateOffice: (office) => {
          set((state) => ({
            ...state,
            office: office,
          }));
        },
      };
    },
    {
      name: 'modals-storage',
    },
  ),
);
