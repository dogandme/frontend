import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { FooterNavigationBar } from "./FooterNavigationBar";
import { getAccessTokenByRefreshToken } from "./api";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    getAccessTokenByRefreshToken().then(({ authorization }) => {
      setToken(authorization);
      if (authorization === "ROLE_NONE") {
        navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
      }
    });
  }, [navigate, setToken]);

  return (
    <div className="mx-auto my-0 flex h-screen max-w-[37.5rem] flex-col">
      <main className="flex grow flex-col overflow-y-scroll">{children}</main>
      <FooterNavigationBar />
    </div>
  );
};
