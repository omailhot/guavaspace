import { PropsWithChildren } from 'react';

import { StepKeys, useAuthFlowStore } from '../../../stores/useAuthFlowStore';

type Props = {
  switchToStep: StepKeys;
};

export const SwitchButton = ({
  children,
  switchToStep,
}: PropsWithChildren<Props>) => {
  const setStep = useAuthFlowStore((s) => s.setStep);

  const handleSwitch = () => {
    setStep(switchToStep);
  };

  return (
    <button
      className="text-primary underline text-sm text-left w-fit"
      onClick={handleSwitch}
      type="button"
    >
      {children}
    </button>
  );
};
