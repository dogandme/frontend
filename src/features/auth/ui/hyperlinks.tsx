import { HTMLAttributes, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { EmailIcon } from "@/shared/ui/icon";
import { useRouteHistoryStore } from "@/shared/store/history";
import { useAuthStore } from "@/shared/store/auth";
import { ROUTER_PATH } from "@/shared/constants";
import { LOGIN_END_POINT } from "../constants";
import { deleteCookie, getCookie } from "@/shared/lib";

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
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.naver} `}
    to={LOGIN_END_POINT.NAVER}
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
    to={LOGIN_END_POINT.NAVER}
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
  const setNickname = useAuthStore((state) => state.setNickname);

  /**
   * 해당 Effect는 다음과 같은 상황을 위해 사용됩니다.
   * 1. 사용자가 토큰을 가진 채로 /login 페이지에 접근 했을 때 로그인 페이지가 아닌 다른 곳으로 리다이렉션 시키기 위해 사용됩니다.
   * 2. OAuth 인증을 마쳐 서버에서 쿠키를 삽입 받은 채 /login 페이지로 리다이렉션 된 경우, 쿠키를 사용해 AuthStore에 정보를 저장합니다.
   * 3. 쿠키에서 로그인 정보를 가져온 후 AuthStore에 상태 값을 저장하고 난 후엔 로그인 페이지가 아닌 다른 곳으로 리다이렉션 됩니다.
   * - 리다이렉션 될 때 클린업 함수로 인해 쿠키에 저장되어있던 인증 정보를 제거합니다.
   */
  useEffect(() => {
    const { token, role, nickname } = useAuthStore.getState();
    const { lastNoneAuthRoute } = useRouteHistoryStore.getState();
    if (token && role && nickname) {
      navigate(lastNoneAuthRoute);
      return;
    }

    const tokenOnCookie = getCookie("authorization");
    const roleOnCookie = getCookie("role");
    const nicknameOnCookie = getCookie("nickname");

    if (tokenOnCookie && roleOnCookie && nicknameOnCookie) {
      setToken(tokenOnCookie);
      setRole(roleOnCookie);
      setNickname(nicknameOnCookie);
      navigate(lastNoneAuthRoute);
    }

    return () => {
      if (tokenOnCookie && roleOnCookie && nicknameOnCookie) {
        deleteCookie({
          name: "authorization",
          value: tokenOnCookie,
          path: "/login",
        });
        deleteCookie({ name: "role", value: roleOnCookie, path: "/login" });
        deleteCookie({
          name: "nickname",
          value: nicknameOnCookie,
          path: "/login",
        });
      }
    };
  }, [navigate, setToken, setRole, setNickname]);

  return (
    <>
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />
    </>
  );
};
