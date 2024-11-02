import { API_BASE_URL } from "@/shared/constants";
import { GetMarkingListRequest } from "../api";
import { GetBoundaryMarkerListRequest } from "../api/getBoundaryMarkerList";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;

export const SEARCH_MARKING_END_POINT = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  lat,
  lng,
  sortType,
  offset,
}: GetMarkingListRequest) =>
  `${API_BASE_URL}/markings/nearby?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&lat=${lat}&lng=${lng}&sortType=${sortType}&offset=${offset}`;

export const MARKER_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: GetBoundaryMarkerListRequest) =>
    `${API_BASE_URL}/markings/marks?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
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
