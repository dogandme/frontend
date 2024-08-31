import { useState, useEffect } from "react";
import type { AuthStore } from "@/shared/store/auth";

interface CookieOption {
  name: string;
  value: string;
  days: number;
  path?: string;
}

const setCookie = (cookieOption: CookieOption) => {
  const { name, value, days, path } = cookieOption;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=" +
    path;
};

const getCookie = (name: string): string | null => {
  return document.cookie.split("; ").reduce(
    (result, cookie) => {
      const parts = cookie.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : result;
    },
    null as string | null,
  );
};

const deleteCookie = (cookieOption: Omit<CookieOption, "days">) => {
  setCookie({ ...cookieOption, days: -1 });
};

type OAuthInformation = Pick<AuthStore, "token" | "role" | "nickname">;

/**
 * 해당 커스텀 훅은 OAuth를 통해 로그인한 사용자의 정보를 쿠키에서 가져옵니다.
 * 커스텀훅은 /login 페이지에 처음 접속 할 때에만 의미를 가집니다.
 * OAuth 이후 쿠키에 정보를 담은 상태에서만 OAuthInformation의 상태가 변경되며
 * 페이지가 언마운트 될 때 OAuth에서 받아온 쿠키를 삭제하기 때문입니다.
 */
export const useOAuthOnCookie = () => {
  const [OAuthInformation, setOAuthInformation] = useState<OAuthInformation>({
    token: null,
    role: null,
    nickname: null,
  });

  useEffect(() => {
    const OAuthInformationFromCookie = {
      token: getCookie("authorization"),
      role: getCookie("role"),
      nickname: getCookie("nickname"),
    };

    setOAuthInformation(OAuthInformationFromCookie);

    return () => {
      deleteCookie({ name: "authorization", value: "", path: "/login" });
      deleteCookie({ name: "role", value: "", path: "/login" });
      deleteCookie({ name: "nickname", value: "", path: "/login" });
    };
  }, []);
  return OAuthInformation;
};
