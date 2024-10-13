import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { NaverIcon, GoogleIcon } from "@/entities/auth/assets";
import { getProfile } from "@/entities/profile/api";
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

  const queryClient = useQueryClient();

  /**
   * 해당 Effect는 다음과 같은 상황을 위해 사용됩니다.
   * 1. 사용자가 토큰을 가진 채로 /login 페이지에 접근 했을 때 로그인 페이지가 아닌 다른 곳으로 리다이렉션 시키기 위해 사용됩니다.
   * 2. OAuth 인증을 마쳐 서버에서 쿠키를 삽입 받은 채 /login 페이지로 리다이렉션 된 경우, 쿠키를 사용해 AuthStore에 정보를 저장합니다.
   * 3. 쿠키에서 로그인 정보를 가져온 후 AuthStore에 상태 값을 저장하고 난 후엔 로그인 페이지가 아닌 다른 곳으로 리다이렉션 됩니다.
   * - 리다이렉션 될 때 클린업 함수로 인해 쿠키에 저장되어있던 인증 정보를 제거합니다.
   *
   * 2024.09.30 업데이트
   * - OAuth Login 을 하고 나면 해당 사용자의 프로필 정보를 prefetch 합니다.
   */
  useEffect(() => {
    const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

    // 로그인을 한 상태로 로그인 페이지에 접근 하는 행위를 방지 합니다.
    if (role === "ROLE_NONE") {
      navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
      return;
    }
    if (role) {
      navigate(lastNoneAuthRoute);
      return;
    }

    // 해당 코드들은 소셜 로그인을 시행 한 후 쿠키에 저장된 인증 정보를 이용하는 코드 들입니다.
    const tokenOnCookie = getCookie("authorization");
    const roleOnCookie = getCookie("role");
    const nicknameOnCookie = getCookie("nickname");

    // 만약 페이지 진입 시 쿠키에 토큰과 권한이 없다면 아무것도 하지 않습니다.
    if (!tokenOnCookie || !roleOnCookie) {
      return;
    }

    setToken(tokenOnCookie);
    setRole(roleOnCookie);

    // 사용자가 추가 정보를 입력하지 않은 경우엔 추가 정보 입력 페이지로 이동 시킵니다.
    if (!nicknameOnCookie) {
      navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
      return;
    }

    // 사용자의 정보가 닉네임밖에 없다면 setQueryData 를 통해 프로필 정보를 설정합니다.
    if (roleOnCookie === "ROLE_GUEST") {
      queryClient.setQueryData(["profile", nicknameOnCookie], {
        nickname: nicknameOnCookie,
        pet: null,
        followers: [],
        followings: [],
        likes: [],
        bookmarks: [],
        tempCnt: 0,
        markings: [],
      });
      setNickname(nicknameOnCookie);
      navigate(lastNoneAuthRoute);
      return;
    }

    // 사용자의 정보가 닉네임 이외에 다른 정보가 있다면 해당 정보를 prefetch 합니다.
    queryClient.prefetchQuery({
      queryKey: ["profile", nicknameOnCookie, tokenOnCookie],
      queryFn: () =>
        getProfile({ nickname: nicknameOnCookie, token: tokenOnCookie }),
    });
    setNickname(nicknameOnCookie);
    navigate(lastNoneAuthRoute);

    // 로그인에 성공하여 리다이렉션 될 때 해당 경로에서 쿠키를 제거 합니다.
    return () => {
      const cookies = [
        { value: tokenOnCookie, name: "authorization" },
        { value: roleOnCookie, name: "role" },
        { value: nicknameOnCookie, name: "nickname" },
      ];

      cookies.forEach(({ value, name }) => {
        if (value) {
          deleteCookie({ name, value, path: "/login" });
        }
      });
    };
  }, [navigate, role, setToken, setRole, setNickname, queryClient]);

  return (
    <>
      <NaverLoginHyperLink />
      <GoogleLoginHyperLink />
    </>
  );
};
