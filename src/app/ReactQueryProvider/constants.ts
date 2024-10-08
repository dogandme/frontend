import { API_BASE_URL } from "@/shared/constants";

// message
export const ERROR_MESSAGE = {
  ACCESS_TOKEN_INVALIDATED: "토큰 검증에 실패했습니다.",
  REFRESH_TOKEN_INVALIDATED: "RefreshToken 검증에 실패했습니다.",
};

// endpoint
export const APP_END_POINT = {
  REFRESH_ACCESS_TOKEN: `${API_BASE_URL}/auth`,
};
