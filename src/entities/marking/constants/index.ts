import type { LatLng, Bounds } from "@/entities/map/@x/marking";
import { API_BASE_URL } from "@/shared/constants";
import type { GetAllMarkingsOfUserRequest } from "../api";
import type { IsVisible, SearchType, SortType } from "../types/server";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: NonNullableObject<LatLng>) =>
  `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;

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
    searchType,
  }: NonNullableObject<Bounds> &
    LatLng & {
      sortType: SortType;
      searchType: SearchType;
      offset: number;
    }) => {
    const latLngQueryParams = lat && lng ? `&lat=${lat}&lng=${lng}` : "";

    return `${API_BASE_URL}/markings/bounds?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&sortType=${sortType}&searchType=${searchType}&offset=${offset}${latLngQueryParams}`;
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
  }: {
    nickname: string;
    offset: number;
    sortType: SortType;
  } & NonNullableObject<Bounds> &
    LatLng) => {
    const latLngQueryParams = lat && lng ? `&lat=${lat}&lng=${lng}` : "";

    return `${API_BASE_URL}/markings/users/${nickname}?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&sortType=${sortType}&offset=${offset}${latLngQueryParams}`;
  },
  ALL_MARKINGS_OF_USER: ({
    nickname,
    sortType,
    offset,
  }: GetAllMarkingsOfUserRequest) => {
    return `${API_BASE_URL}/markings/users/${nickname}?sortType=${sortType}&offset=${offset}&mapViewMode=ALL_VIEW`;
  },

  MY_LIKED: ({ offset }: { offset: number }) =>
    `${API_BASE_URL}/markings/likes?offset=${offset}`,
  MY_SAVED: ({ offset }: { offset: number }) =>
    `${API_BASE_URL}/markings/saves?offset=${offset}`,

  DETAIL: ({ markingId }: { markingId: number }) =>
    `${API_BASE_URL}/markings/${markingId}`,
};

export const MARKER_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: NonNullableObject<Bounds>) =>
    `${API_BASE_URL}/markings/marks?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,

  MY: `${API_BASE_URL}/markings/my-marks`,
  MY_ACTIVITY: (activity: "likes" | "saves") =>
    `${API_BASE_URL}/markings/marks/${activity}`,
};

export const MY_MARKING_END_POINT = {
  TEMPORARY: (offset: number) =>
    `${API_BASE_URL}/markings/temps?offset=${offset}`,
};

export const MARKING_THUMBNAIL_END_POINT = {
  DASHBOARD: (nickname: string, pageParams: number) =>
    `${API_BASE_URL}/markings/marks/${nickname}?offset=${pageParams}`,
};

export const MARKING_VISIBILITY_MAP = {
  PUBLIC: "전체 공개",
  PRIVATE: "나만 보기",
  FOLLOW_ONLY: "팔로우 공개",
} as const;

export const MARKING_VISIBILITY_ENTRIES = Object.entries(
  MARKING_VISIBILITY_MAP,
) as [IsVisible, (typeof MARKING_VISIBILITY_MAP)[IsVisible]][];
