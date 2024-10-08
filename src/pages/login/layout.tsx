import { Outlet } from "react-router-dom";
import { AuthNavigationBar } from "@/features/auth/ui";

const LoginLayout = () => (
  <>
    <header>
      <AuthNavigationBar />
    </header>
    <main className="flex flex-col items-start gap-8 self-stretch px-4 pb-32 pt-8">
      <Outlet />
    </main>
  </>
);

export default LoginLayout;
