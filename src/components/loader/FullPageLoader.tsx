export const FullPageLoader = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="text-xl font-extrabold text-primary">
        Loading <span className="animate-pulse">.</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse">.</span>
      </div>
    </div>
  );
};
