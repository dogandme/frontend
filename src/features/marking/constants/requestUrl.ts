import { MarkingListRequest } from "../api";
import { LikeMarkingRequest } from "../api/likeMarking";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const MARKING_REQUEST_URL = {
  SEARCH_MARKING: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: Omit<MarkingListRequest, "token">) =>
    `${API_BASE_URL}/markings/search?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
  ADD: `${API_BASE_URL}/markings`,
  SAVE_TEMP: `${API_BASE_URL}/markings/temp`,
  DELETE: `${API_BASE_URL}/markings`,
  LIKE: (markingId: LikeMarkingRequest["markingId"]) =>
    `${API_BASE_URL}/markings/like/${markingId}`,
  SAVE: (markingId: LikeMarkingRequest["markingId"]) =>
    `${API_BASE_URL}/markings/saves/${markingId}`,
};
