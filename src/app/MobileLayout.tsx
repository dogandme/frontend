export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto my-0 flex h-screen max-w-[37.5rem] flex-col">
      {children}
    </div>
  );
};
