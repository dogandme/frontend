import { API_BASE_URL } from "@/shared/constants";

export const LOGIN_END_POINT = {
  GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
  NAVER: `${API_BASE_URL}/oauth2/authorization/naver`,
  EMAIL: `${API_BASE_URL}/login`,
};

export const SIGN_UP_END_POINT = {
  EMAIL: `${API_BASE_URL}/users`,
  VERIFICATION_CODE: `${API_BASE_URL}/users/auth`,
  CHECK_VERIFICATION_CODE: `${API_BASE_URL}/users/auth/check`,
  DUPLICATE_NICKNAME: `${API_BASE_URL}/users/nickname`,
  USER_INFO: `${API_BASE_URL}/users/additional-info`,
  PET_INFO: `${API_BASE_URL}/pets`,
};

export const CHANGE_USER_INFO_END_POINT = {
  NICKNAME: `${API_BASE_URL}/users/profile/nickname`,
};
