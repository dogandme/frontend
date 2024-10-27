import { apiClient } from "@/shared/lib";
import { APP_END_POINT } from "./ReactQueryProvider/constants";

interface getAccessTokenByRefreshTokenResponse {
  authorization: string;
}

export const getAccessTokenByRefreshToken = () =>
  apiClient.get<getAccessTokenByRefreshTokenResponse>(
    APP_END_POINT.REFRESH_ACCESS_TOKEN,
    {
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
    },
  );
