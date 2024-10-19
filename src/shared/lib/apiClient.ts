import { API_BASE_URL } from "../constants";
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

    const options: RequestInit = {
      method,
      headers: httpHeaders,
      credentials,
    };

    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL + url}`, options);

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
