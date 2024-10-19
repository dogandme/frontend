import { API_BASE_URL } from "../constants";
import { useAuthStore } from "../store";
import { HttpError } from "./error";

type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

interface Response<T = undefined> {
  code: number;
  message: string;
  content: T extends undefined ? never : T;
}

interface FetcherOptions {
  method: Method;
  headers?: HeadersInit;
  body?: RequestInit["body"];
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

    const response = await fetch(`${API_BASE_URL + url}`, {
      method,
      headers,
      body:
        httpHeaders.get("Content-Type") === "application/json"
          ? JSON.stringify(body)
          : body,
      credentials,
    });

    if (!response.ok) {
      const { code, message }: Response = await response.json();

      throw new HttpError({ code, message });
    }

    const { content }: Response<T> = await response.json();

    return content;
  } catch (error) {
    if (error instanceof HttpError) {
      console.error(error.message);
    }
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
