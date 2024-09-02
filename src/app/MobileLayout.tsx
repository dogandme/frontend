export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto my-0 min-h-[3.25rem] w-full min-w-80 max-w-[37.5rem]">
      {children}
    </div>
  );
};
