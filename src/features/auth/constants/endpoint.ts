// TODO BASEURL env 파일로 수정하기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LOGIN_END_POINT = {
  GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
  NAVER: `${API_BASE_URL}/oauth2/authorization/naver`,
  EMAIL: `${API_BASE_URL}/login`,
};

export const SIGN_UP_END_POINT = {
  EMAIL: `${API_BASE_URL}/users`,
  VERIFICATION_CODE: `${API_BASE_URL}/users/auth`,
  CHECK_VERIFICATION_CODE: `${API_BASE_URL}/users/auth/check`,
  USER_INFO: `${API_BASE_URL}/users/additional-info`,
  PET_INFO: `${API_BASE_URL}/pets`,
};
