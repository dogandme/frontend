import { API_BASE_URL } from "@/shared/constants";
import { GetMarkingListRequest } from "../api";

export const MARKING_END_POINT = {
  SEARCH_MARKING: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: Omit<GetMarkingListRequest, "token">) =>
    `${API_BASE_URL}/markings/search?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
  ADD: `${API_BASE_URL}/markings`,
  SAVE_TEMP: `${API_BASE_URL}/markings/temp`,
  DELETE: "/markings",
  LIKE: (markingId: number) => `${API_BASE_URL}/markings/like/${markingId}`,
  SAVE: (markingId: number) => `${API_BASE_URL}/markings/saves/${markingId}`,
};
