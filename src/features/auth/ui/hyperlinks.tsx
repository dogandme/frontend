import { HTMLAttributes, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { EmailIcon } from "@/shared/ui/icon";
import { useRouteHistoryStore } from "@/shared/store/history";
import { useAuthStore } from "@/shared/store/auth";
import { ROUTER_PATH } from "@/shared/constants";
import { LOGIN_END_POINT } from "../constants";
import { useOAuthOnCookie } from "../api/oauth";

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

/**
 * OAuth 와 관련된 컴포넌트는 로그인에 성공 하여 쿠키에 정보를 담아 /login 페이지로 리다이렉션 된 경우
 * 다음과 같은 라이프 사이클을 갖습니다.
 * 1. useOAuthOnCookie 훅을 통해 token , role , nickname이 null 인 상태에서 초기 렌더링
 * 2. useOAuthOnCookie 내부 effect 를 통해 token , role , nickname 이 쿠키에서 값을 추출하여 상태 변경
 * 3. OAuthLoginHyperLinks 컴포넌트 내부에서 token , role , nickname 이 변경되면서 리렌더링
 * 4. 렌더링 이후 OAuthLoginHyperLinks 의 Effect 가 발동 되어 변경된 token  ,role , nickname 을 store에 저장
 * 5. 이후 로그인을 하지 않았던 페이지로 리다이렉션
 * 6. 리다이렉션이 일어나며 useOAuthOnCookie 내부 클린업 함수가 발동되어 쿠키를 삭제
 * ps. 쿠키가 삭제되어도 useAuthStore 내부의 상태는 변하지 않습니다.
 */
export const OAuthLoginHyperLinks = () => {
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setNickname = useAuthStore((state) => state.setNickname);

  const {
    token: tokenOnCookie,
    role: roleOnCookie,
    nickname: nicknameOnCookie,
  } = useOAuthOnCookie();

  useEffect(() => {
    // Oauth login 에 성공하여 쿠키에 정보가 있을 떄에만 스토어에 값을 저장하고 리다이렉션 합니다.
    if (tokenOnCookie && roleOnCookie && nicknameOnCookie) {
      const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

      setToken(tokenOnCookie);
      setRole(roleOnCookie);
      setNickname(nicknameOnCookie);

      navigate(lastNoneAuthRoute);
    }
  }, [
    tokenOnCookie,
    roleOnCookie,
    nicknameOnCookie,
    setToken,
    setRole,
    setNickname,
    navigate,
  ]);

  return (
    <>
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />
    </>
  );
};
