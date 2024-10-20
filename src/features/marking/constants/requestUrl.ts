import { GetMarkingListRequestData } from "../api";

export const MARKING_REQUEST_URL = {
  SEARCH_MARKING: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: Omit<GetMarkingListRequestData, "token">) =>
    `/markings/search?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
  ADD: `/markings`,
  SAVE_TEMP: `/markings/temp`,
  DELETE: "/markings",
  LIKE: (markingId: number) => `/markings/like/${markingId}`,
  SAVE: (markingId: number) => `/markings/saves/${markingId}`,
};
