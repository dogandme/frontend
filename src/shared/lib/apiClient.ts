import { useAuthStore } from "../store";
import { HttpError } from "./error";

type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

interface Response {
  code: number;
  message: string;
}

interface SuccessResponse<T> extends Response {
  content: T;
}

interface FetcherOptions {
  method: Method;
  headers?: HeadersInit;
  body?: unknown;
  credentials?: RequestInit["credentials"];
  withToken?: boolean;
}

/**
 * body가 FormData 인스턴스일 경우 body를 그대로 서버에 전송하고, 그 외의 경우 JSON.stringify를 감싸서 전송합니다.
 * 응답이 성공적으로 왔을 경우 content만 반환합니다.
 * 응답이 실패했을 경우 HttpError를 throw 합니다.
 *
 * @param url 서버 api url
 * @param method HTTP 메소드
 * @param headers HTTP 헤더
 * @param withToken 토큰을 HTTP 헤더에 담아줄지 여부
 * @param body HTTP 요청 바디
 * @param credentials HTTP 요청의 credentials
 * @returns
 */
const fetcher = async <T>(
  url: string,
  { method, headers, withToken = false, body, credentials }: FetcherOptions,
) => {
  try {
    const httpHeaders = new Headers(headers || {});

    if (withToken) {
      const { token } = useAuthStore.getState();

      if (token) httpHeaders.set("Authorization", token);
    }

    if (body && !(body instanceof FormData)) {
      httpHeaders.set("Content-Type", "application/json");
    }

    const options: RequestInit = {
      method,
      headers: httpHeaders,
      credentials,
    };

    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const { code, message }: Response = await response.json();

      throw new HttpError({ code, message });
    }

    const { content }: SuccessResponse<T> = await response.json();

    return content;
  } catch (error) {
    if (error instanceof HttpError) {
      console.error(error.message);
    }

    throw error;
  }
};

export const apiClient = {
  get: <T>(
    url: string,
    {
      headers,
      credentials,
      withToken,
    }: Omit<FetcherOptions, "method" | "body">,
  ) => fetcher<T>(url, { method: "GET", headers, credentials, withToken }),
  post: <T>(url: string, options: Omit<FetcherOptions, "method">) =>
    fetcher<T>(url, { method: "POST", ...options }),
  delete: <T>(url: string, options: Omit<FetcherOptions, "method">) =>
    fetcher<T>(url, { method: "DELETE", ...options }),
  patch: <T>(url: string, options: Omit<FetcherOptions, "method">) =>
    fetcher<T>(url, { method: "PATCH", ...options }),
  put: <T>(url: string, options: Omit<FetcherOptions, "method">) =>
    fetcher<T>(url, { method: "PUT", ...options }),
};
