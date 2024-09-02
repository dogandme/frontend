export interface CookieOption {
  name: string;
  value: string;
  days: number;
  path?: string;
}

export const setCookie = (cookieOption: CookieOption) => {
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

export const getCookie = (name: string): string | null => {
  return document.cookie.split("; ").reduce(
    (result, cookie) => {
      const parts = cookie.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : result;
    },
    null as string | null,
  );
};

export const deleteCookie = (cookieOption: Omit<CookieOption, "days">) => {
  setCookie({ ...cookieOption, days: -1 });
};
