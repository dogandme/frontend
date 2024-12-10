import type { SignUpResponse } from "@/features/auth/type/server";
import { apiClient } from "@/shared/lib";
import { APP_END_POINT } from "./ReactQueryProvider/constants";

export const getAccessTokenByRefreshToken = () =>
  apiClient.get<SignUpResponse>(APP_END_POINT.REFRESH_ACCESS_TOKEN, {
    credentials:
      process.env.NODE_ENV === "development" ? "include" : "same-origin",
  });
