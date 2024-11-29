import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { FooterNavigationBar } from "./FooterNavigationBar";
import { getAccessTokenByRefreshToken } from "./api";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (
      (
        window as Window &
          typeof globalThis & { __STORYBOOK_ADDONS_CHANNEL__?: unknown }
      ).__STORYBOOK_ADDONS_CHANNEL__
    ) {
      return;
    }

    getAccessTokenByRefreshToken()
      .then(({ authorization, role, nickname }) => {
        useAuthStore.setState({ token: authorization, role, nickname });

        if (authorization === "ROLE_NONE") {
          navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="mx-auto my-0 flex h-screen max-w-[37.5rem] flex-col">
      <main className="flex grow flex-col overflow-y-scroll">{children}</main>
      <FooterNavigationBar />
    </div>
  );
};
