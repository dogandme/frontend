import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { ROUTER_PATH } from "@/shared/constants";
import { deleteCookie, getCookie } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { EmailIcon } from "@/shared/ui/icon";
import { LOGIN_END_POINT } from "../constants";

/* ----------------------------------컴포넌트 내부에서만 사용되는 컴포넌트------------------------------- */
const hyperLinkColorMap = {
  naver: "bg-[#00BF18]",
  google: "bg-grey-0 border border-grey-900",
  email: "bg-grey-900",
};

const LoginHyperLinkClass =
  "flex h-12 items-center justify-center gap-[10px] self-stretch rounded-2xl pl-4 pr-6";

const NaverLoginHyperLink = () => (
  <a
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.naver} `}
    href={LOGIN_END_POINT.NAVER}
  >
    <NaverIcon />
    <p className="button-2 text-center text-grey-0">Naver로 계속하기</p>
  </a>
);

const GoogleLoginHyperLink = () => (
  <a
    className={`${LoginHyperLinkClass} ${hyperLinkColorMap.google}`}
    href={LOGIN_END_POINT.GOOGLE}
  >
    <GoogleIcon />
    <p className="button-2 text-center text-grey-900">Google로 계속하기</p>
  </a>
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
  const role = useAuthStore((state) => state.role);

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
    const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

    /* 기존 권한이 존재한다면 가장 마지막으로 접속한 페이지로 네비게이팅 시킵니다. */
    if (role) {
      navigate(lastNoneAuthRoute);
      return;
    }

    const tokenOnCookie = getCookie("authorization");
    const roleOnCookie = getCookie("role");
    const nicknameOnCookie = getCookie("nickname");

    /* 만약 페이지 진입 시 쿠키에 토큰과 권한이 없다면 아무것도 하지 않습니다. */
    if (!tokenOnCookie || !roleOnCookie) {
      return;
    }

    setToken(tokenOnCookie);
    setRole(roleOnCookie);

    /* 만약 사용자가 소셜 로그인을 이용해 회원가입 한 경우에는 기본 정보 입력 페이지로 리다이렉션 시킵니다. */
    if (!nicknameOnCookie) {
      navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
      return;
    }

    setNickname(nicknameOnCookie);
    navigate(lastNoneAuthRoute);
  });

  useEffect(() => {
    return () => {
      ["authorization", "role", "nickname"].forEach((name) =>
        deleteCookie({ name, value: "", path: "/login" }),
      );
    };
  });

  return (
    <>
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />
    </>
  );
};
