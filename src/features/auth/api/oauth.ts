import { useEffect, useState } from "react";

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
};

const getCookie = (name: string) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

const deleteCookie = (name: string) => {
  setCookie(name, "", -1);
};

export const useOAuthLogin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    setToken(getCookie("authorization"));
    setRole(getCookie("role"));
    setUserId(Number(getCookie("userId")));
    setNickname(getCookie("nickname"));

    return () => {
      deleteCookie("authorization");
      deleteCookie("role");
      deleteCookie("userId");
      deleteCookie("nickname");
    };
  }, []);

  return { token, role, userId, nickname };
};
