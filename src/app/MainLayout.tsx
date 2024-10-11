import { FooterNavigationBar } from "./FooterNavigationBar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto my-0 flex h-screen max-w-[37.5rem] flex-col">
      <main className="flex grow flex-col overflow-y-scroll">{children}</main>
      <FooterNavigationBar />
    </div>
  );
};
