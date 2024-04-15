import { LoaderText } from './LoaderText';

export const FullPageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoaderText />
    </div>
  );
};
