import type { SortType } from "@/entities/marking/api";

export const sortTypeMap: Record<SortType, string> = {
  RECENT: "최신순",
  DISTANCE: "가까운순",
  POPULARITY: "인기순",
};

export const RangeFilterMap = {
  ALL_VIEW: "전체보기", // 내 마킹에서만 있는 option
  CURRENT_LOCATION: "내 위치 중심",
  MAP_LOCATION: "현재 지도 중심",
};

export const MAP_INITIAL_CENTER = { lat: 37.5665, lng: 126.978 };
export const MAP_INITIAL_ZOOM = 16;
export const MAP_INITIAL_BOUNDS = {
  east: 126.98218424603498,
  north: 37.572444179048894,
  south: 37.56055534657849,
  west: 126.97381575396503,
};
