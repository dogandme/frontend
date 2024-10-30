import { API_BASE_URL } from "@/shared/constants";

export const MARKING_END_POINT = {
  ADD: `${API_BASE_URL}/markings`,
  SAVE_TEMP: `${API_BASE_URL}/markings/temp`,
  LIKE: (markingId: number) => `${API_BASE_URL}/markings/likes/${markingId}`,
  DELETE: `${API_BASE_URL}/markings`,
  SAVE: (markingId: number) => `${API_BASE_URL}/markings/saves/${markingId}`,
  PUT_MODIFY_TEMP_MARKING: `${API_BASE_URL}/markings/temp`,
  DELETE_TEMPORARY_MARKING: `${API_BASE_URL}/markings/temp`,
};
