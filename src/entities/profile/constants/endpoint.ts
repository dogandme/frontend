import { API_BASE_URL } from "@/shared/constants";

export const PROFILE_END_POINT = {
  PROFILE: (nickname: string) => `${API_BASE_URL}/profile?nickname=${nickname}`,
};
