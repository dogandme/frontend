import { Outlet } from "react-router-dom";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

interface LoginLayoutProps {
  OverlayPortal: React.ReactNode;
  HistoryTracker: React.ReactNode;
}

const LoginLayout = ({ OverlayPortal, HistoryTracker }: LoginLayoutProps) => (
  <>
    {OverlayPortal}
    {HistoryTracker}
    <header>
      <BackwardNavigationBar />
    </header>
    <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
      <Outlet />
    </main>
  </>
);

export default LoginLayout;
