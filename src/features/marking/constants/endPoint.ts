import { GetMarkingListRequest } from "../api";

export const MARKING_END_POINT = {
  SEARCH_MARKING: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: Omit<GetMarkingListRequest, "token">) =>
    `/markings/search?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
  ADD: `/markings`,
  SAVE_TEMP: `/markings/temp`,
  DELETE: "/markings",
  LIKE: (markingId: number) => `/markings/like/${markingId}`,
  SAVE: (markingId: number) => `/markings/saves/${markingId}`,
};
