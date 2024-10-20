import { API_BASE_URL } from "@/shared/constants";

export const LOGIN_END_POINT = {
  GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
  NAVER: `${API_BASE_URL}/oauth2/authorization/naver`,
  EMAIL: "/login",
};

export const SIGN_UP_END_POINT = {
  EMAIL: `${API_BASE_URL}/users`,
  VERIFICATION_CODE: "/users/auth",
  CHECK_VERIFICATION_CODE: "/users/auth/check",
  DUPLICATE_NICKNAME: `${API_BASE_URL}/users/nickname`,
  USER_INFO: `${API_BASE_URL}/users/additional-info`,
  PET_INFO: "/pets",
};

export const CHANGE_USER_INFO_END_POINT = {
  NICKNAME: "/users/profile/nickname",
};
