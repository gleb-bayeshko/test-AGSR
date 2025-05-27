// api клиент для унификации запросов, обработки ошибок авторизации и рефреша токенов

import { enqueueSnackbar } from "notistack";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<TBody = unknown> extends Omit<RequestInit, "body"> {
  headers?: HeadersInit;
  body?: TBody;
  auth?: boolean;
}

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokensAndRedirect = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  redirectToLogin();
};

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

const apiFetch = async <TResponse = unknown, TBody = unknown>(
  url: string,
  method: HttpMethod,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> => {
  const { body, headers = {}, auth = false, ...rest } = options;

  let token = auth ? getAccessToken() : null;

  const doFetch = async (): Promise<Response> =>
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });

  let response = await doFetch();

  if (response.status === 401 && auth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      token = getAccessToken();
      response = await doFetch();
    } else {
      clearTokensAndRedirect();
      const errorMessage = "Необходима повторная авторизация";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw new Error(errorMessage);
    }
  }

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const error = isJson ? await response.json() : await response.text();
    const errorMessage =
      typeof error === "string" ? error : error?.error || "Ошибка запроса";
    enqueueSnackbar(errorMessage, { variant: "error" });
    throw new Error(errorMessage);
  }

  return isJson ? response.json() : ({} as TResponse);
};

export const apiClient = {
  get: <TResponse>(url: string, options?: RequestOptions) =>
    apiFetch<TResponse>(url, "GET", options),
  post: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions<TBody>
  ) => apiFetch<TResponse, TBody>(url, "POST", { ...options, body }),
  put: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions<TBody>
  ) => apiFetch<TResponse, TBody>(url, "PUT", { ...options, body }),
  delete: <TResponse>(url: string, options?: RequestOptions) =>
    apiFetch<TResponse>(url, "DELETE", options),
};
