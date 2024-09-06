import { HistoryTracker } from "@/app";
import { OverlayPortal } from "@/app/OverlayPortal";
import { BackwardNavigationBar } from "@/widgets/navigationbar/ui";
import { Outlet } from "react-router-dom";
const LoginLayout = () => (
  <>
    <OverlayPortal />
    <HistoryTracker />
    <header>
      <BackwardNavigationBar />
    </header>
    <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
      <Outlet />
    </main>
  </>
);

export default LoginLayout;
