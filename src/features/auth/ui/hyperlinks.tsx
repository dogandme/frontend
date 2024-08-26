import { HTMLAttributes, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { EmailIcon } from "@/shared/ui/icon";
import { useAuthStore } from "@/shared/store/auth";
import { ROUTER_PATH } from "@/shared/constants";
import { useOauthLogin } from "../api";
import type { OAuthServerName } from "../api";

/* ----------------------------------컴포넌트 내부에서만 사용되는 컴포넌트------------------------------- */
const hyperLinkColorMap = {
  naver: "bg-[#00BF18]",
  google: "bg-grey-0 border border-grey-900",
  email: "bg-grey-900",
};

const LoginHyperLinkClass =
  "flex h-12 items-center justify-center gap-[10px] self-stretch rounded-2xl pl-4 pr-6";

const NaverLoginHyperLink = (props: HTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.naver} `}
    {...props}
  >
    <NaverIcon />
    <p className="button-2 text-center text-grey-0">Naver로 계속하기</p>
  </button>
);

const GoogleLoginHyperLink = (props: HTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.google}`}
    {...props}
  >
    <GoogleIcon />
    <p className="button-2 text-center text-grey-900">Google로 계속하기</p>
  </button>
);

/* ----------------------------------컴포넌트 외부로 export 되어 사용되는 컴포넌트------------------------------- */

export const EmailLoginHyperLink = () => (
  <Link
    to={ROUTER_PATH.LOGIN_BY_EMAIL}
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.email}`}
  >
    <EmailIcon fill="#D9D9D9" />
    <p className="button-2 text-center text-grey-0">이메일로 계속하기</p>
  </Link>
);

export const OAuthLoginHyperLinks = () => {
  const [OAuthServerName, setOAuthServerName] =
    useState<OAuthServerName | null>(null);

  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  const { data: authResponse } = useOauthLogin(OAuthServerName);

  useEffect(() => {
    if (authResponse) {
      const { token, role } = authResponse.content;

      setToken(token);
      setRole(role);
    }
  }, [authResponse, setToken, setRole]);

  return (
    <>
      <NaverLoginHyperLink onClick={() => setOAuthServerName("NAVER")} />
      <GoogleLoginHyperLink onClick={() => setOAuthServerName("GOOGLE")} />
    </>
  );
};