import { LoaderIcon } from 'lucide-react';

export const GlobalLoader = () => {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <LoaderIcon className="animate-spin" size={24} />
    </div>
  );
};
