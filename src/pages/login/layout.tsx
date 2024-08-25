import { Outlet } from "react-router-dom";
import { BackwardNavigationBar } from "@/widgets/navigationbar/ui";
const LoginLayout = () => (
  <>
    <BackwardNavigationBar />
    <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
      <Outlet />
    </main>
  </>
);

export default LoginLayout;
