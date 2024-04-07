import { createContext, PropsWithChildren, useContext } from 'react';

import { OfficeDetailsType } from '../components/office-details/OfficeDetails';

export type OfficeContextType = {
  office: OfficeDetailsType;
  isEdit: boolean;
};

const OfficeContext = createContext<OfficeContextType | null>(null);

export const useOfficeContext = () => {
  const context = useContext(OfficeContext);

  if (context === undefined) {
    throw new Error('OfficeContext must be used within a AuthProvider');
  }

  return context as OfficeContextType;
};

export const OfficeProvider = ({
  office,
  isEdit = false,
  children,
}: PropsWithChildren<OfficeContextType>) => {
  return (
    <OfficeContext.Provider value={{ office, isEdit }}>
      {children}
    </OfficeContext.Provider>
  );
};
