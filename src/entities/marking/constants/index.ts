import { API_BASE_URL } from "@/shared/constants";
import type { GetMarkingListRequest, GetUserMarkingListRequest } from "../api";
import type { GetBoundaryMarkerListRequest } from "../api/getBoundaryMarkerList";
import type { GetMyLikedMarkingListRequest } from "../api/getMyLikedMarkingList";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;

export const MARKING_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
    lat,
    lng,
    sortType,
    offset,
  }: GetMarkingListRequest) => {
    const latLngQueryParams = lat && lng ? `&lat=${lat}&lng=${lng}` : "";

    return `${API_BASE_URL}/markings/bounds?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&sortType=${sortType}&offset=${offset}${latLngQueryParams}`;
  },

  USER: ({
    nickname,
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
    lat,
    lng,
    sortType,
    offset,
  }: GetUserMarkingListRequest) => {
    const latLngQueryParams = lat && lng ? `&lat=${lat}&lng=${lng}` : "";

    return `${API_BASE_URL}/markings/users/${nickname}?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&sortType=${sortType}&offset=${offset}${latLngQueryParams}`;
  },

  MY_LIKED: ({ offset }: GetMyLikedMarkingListRequest) =>
    `${API_BASE_URL}/markings/likes?offset=${offset}`,
};

export const MARKER_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: GetBoundaryMarkerListRequest) =>
    `${API_BASE_URL}/markings/marks?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,

  MY: `${API_BASE_URL}/markings/my-marks`,
};

export const MY_MARKING_END_POINT = {
  TEMPORARY: (offset: number) =>
    `${API_BASE_URL}/markings/temps?offset=${offset}`,
};

export const MARKING_VISIBILITY_MAP = {
  PUBLIC: "전체 공개",
  PRIVATE: "나만 보기",
  FOLLOW_ONLY: "팔로우 공개",
} as const;

export type MarkingVisibilityKey = keyof typeof MARKING_VISIBILITY_MAP;
export type MarkingVisibilityValue =
  (typeof MARKING_VISIBILITY_MAP)[MarkingVisibilityKey];

export const MARKING_VISIBILITY_ENTRIES = Object.entries(
  MARKING_VISIBILITY_MAP,
) as [MarkingVisibilityKey, MarkingVisibilityValue][];
