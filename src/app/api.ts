import { Nickname } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import type { Role } from "@/shared/store";
import { APP_END_POINT } from "./ReactQueryProvider/constants";

interface GetAccessTokenByRefreshTokenResponse {
  authorization: string;
  role: NonNullable<Role>;
  nickname: Nickname;
}

export const getAccessTokenByRefreshToken = () =>
  apiClient.get<GetAccessTokenByRefreshTokenResponse>(
    APP_END_POINT.REFRESH_ACCESS_TOKEN,
    {
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
    },
  );
