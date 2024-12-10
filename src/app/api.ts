import type { SignUpResponse } from "@/features/auth/type/server";
import { apiClient } from "@/shared/lib";
import type { Role } from "@/shared/store";
import { APP_END_POINT } from "./ReactQueryProvider/constants";

export const getAccessTokenByRefreshToken = () =>
  apiClient.get<SignUpResponse<NonNullable<Role>>>(
    APP_END_POINT.REFRESH_ACCESS_TOKEN,
    {
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
    },
  );
