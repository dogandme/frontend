import { API_BASE_URL } from "@/shared/constants";

export const SETTING_END_POINT = {
  LOGOUT: `${API_BASE_URL}/logout`,
  CHANGE_REGION: `${API_BASE_URL}/users/profile/addresses`,
  DELETE_ACCOUNT: `${API_BASE_URL}/users/me`,
  CHANGE_GENDER: `${API_BASE_URL}/users/profile/gender`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/profile/password`,
  SET_PASSWORD: `${API_BASE_URL}/users/profile/password/social`,
  CHANGE_AGE: `${API_BASE_URL}/users/profile/age`,
  CHANGE_PET_INFO: `${API_BASE_URL}/pets`,
};
