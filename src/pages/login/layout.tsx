import { Outlet } from "react-router-dom";
import { AuthNavigationBar } from "@/features/auth/ui";

interface LoginLayoutProps {
  OverlayPortal: JSX.Element;
  HistoryTracker: JSX.Element;
}

const LoginLayout = ({ OverlayPortal, HistoryTracker }: LoginLayoutProps) => (
  <>
    {OverlayPortal}
    {HistoryTracker}
    <header>
      <AuthNavigationBar />
    </header>
    <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
      <Outlet />
    </main>
  </>
);

export default LoginLayout;
