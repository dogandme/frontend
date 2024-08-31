import { HTMLAttributes, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { EmailIcon } from "@/shared/ui/icon";
import { useRouteHistoryStore } from "@/shared/store/history";
import { useAuthStore } from "@/shared/store/auth";
import { ROUTER_PATH } from "@/shared/constants";
import { useOAuthLogin } from "../api/oauth";
import { LOGIN_END_POINT } from "../constants";

/* ----------------------------------컴포넌트 내부에서만 사용되는 컴포넌트------------------------------- */
const hyperLinkColorMap = {
  naver: "bg-[#00BF18]",
  google: "bg-grey-0 border border-grey-900",
  email: "bg-grey-900",
};

const LoginHyperLinkClass =
  "flex h-12 items-center justify-center gap-[10px] self-stretch rounded-2xl pl-4 pr-6";

const NaverLoginHyperLink = (props: HTMLAttributes<HTMLAnchorElement>) => (
  <Link
    to={LOGIN_END_POINT.NAVER}
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.naver} `}
    {...props}
  >
    <NaverIcon />
    <p className="button-2 text-center text-grey-0">Naver로 계속하기</p>
  </Link>
);

const GoogleLoginHyperLink = (props: HTMLAttributes<HTMLAnchorElement>) => (
  <Link
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.google}`}
    {...props}
    to={LOGIN_END_POINT.GOOGLE}
  >
    <GoogleIcon />
    <p className="button-2 text-center text-grey-900">Google로 계속하기</p>
  </Link>
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
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);
  const setNickname = useAuthStore((state) => state.setNickname);

  const { lastNoneAuthRoute } = useRouteHistoryStore();
  const { token, role, userId, nickname } = useOAuthLogin();

  useEffect(() => {
    if (token && role && userId && nickname) {
      setToken(token);
      setRole(role);
      setUserId(userId);
      setNickname(nickname);
      navigate(lastNoneAuthRoute);
    }
  }, [
    token,
    role,
    userId,
    nickname,
    lastNoneAuthRoute,
    setNickname,
    setToken,
    setRole,
    setUserId,
    navigate,
  ]);

  return (
    <>
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />{" "}
    </>
  );
};
