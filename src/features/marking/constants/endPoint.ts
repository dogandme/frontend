import { API_BASE_URL } from "@/shared/constants";

export const MARKING_END_POINT = {
  ADD: `${API_BASE_URL}/markings`,
  SAVE_TEMP: `${API_BASE_URL}/markings/temp`,
  DELETE: "/markings",
  LIKE: (markingId: number) => `${API_BASE_URL}/markings/like/${markingId}`,
  SAVE: (markingId: number) => `${API_BASE_URL}/markings/saves/${markingId}`,
};
