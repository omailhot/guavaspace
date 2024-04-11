import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type OfficeReservationProps = {
  from: Date;
  to: Date;
  seats: number;
};

interface ReservationState {
  data?: OfficeReservationProps;
  setData: (data: OfficeReservationProps) => void;
}

export const useReservationStore = create<ReservationState>()(
  devtools(
    (set) => {
      return {
        data: undefined,
        setData: (data) => {
          set({ data });
        },
      };
    },

    {
      name: 'reservation-store',
    },
  ),
);
