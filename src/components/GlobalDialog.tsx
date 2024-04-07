import { DialogProps } from '@radix-ui/react-dialog';
import { PropsWithChildren } from 'react';

import { ModalKeys, useDialogsStore } from '../stores/useDialogsStore';
import { Dialog } from './ui/dialog';

type Props = {
  id: ModalKeys;
} & DialogProps;

export const GlobalDialog = ({
  id,
  children,
  onOpenChange,
  ...props
}: PropsWithChildren<Props>) => {
  const open = useDialogsStore((s) => s.modals[id]);
  const toggleModal = useDialogsStore((s) => s.toggleModal);

  return (
    <Dialog
      onOpenChange={(open) => {
        onOpenChange?.(open);
        toggleModal(id, open);
      }}
      open={open}
      {...props}
    >
      {children}
    </Dialog>
  );
};
