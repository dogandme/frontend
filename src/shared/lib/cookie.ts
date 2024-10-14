export interface CookieOption {
  name: string;
  value: string;
  path?: string;
  maxAge: number;
}

export const setCookie = (cookieOption: CookieOption) => {
  const { name, value, maxAge, path } = cookieOption;
  document.cookie =
    name +
    "=" +
    value +
    "; max-age=" +
    maxAge +
    "; path=" +
    path +
    "; domain=" +
    window.location.hostname;

  console.log(
    name +
      "=" +
      value +
      "; maxAge=" +
      maxAge +
      "; path=" +
      path +
      "; domain=" +
      window.location.hostname,
  );
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

export const deleteCookie = (cookieOption: Omit<CookieOption, "maxAge">) => {
  setCookie({ ...cookieOption, maxAge: 0 });
};
