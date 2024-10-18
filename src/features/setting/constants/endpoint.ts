import { API_BASE_URL } from "@/shared/constants";

export const SETTING_END_POINT = {
  LOGOUT: `${API_BASE_URL}/logout`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/profile/password`,
  SET_PASSWORD: `${API_BASE_URL}/users/profile/password/social`,
  CHANGE_AGE: `${API_BASE_URL}/users/profile/age`,
};
