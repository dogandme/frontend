import type { LatLng, Bounds } from "@/entities/map/@x/marking";
import type { SearchType, SortType } from "../types/server";

type Activity = "LIKED" | "SAVED";

export const markingQueryKey = {
  address: (latLng: NonNullableObject<LatLng>) =>
    ["address", { latLng }] as const,
  markingListAll: () => ["markingList"] as const,
  detail: (markingId: number) =>
    [...markingQueryKey.markingListAll(), { markingId }] as const,
  boundaryMarkingList: (
    bounds: Bounds,
    latLng: LatLng,
    sortType: SortType,
    searchType: SearchType,
  ) =>
    [
      ...markingQueryKey.markingListAll(),
      { bounds },
      { latLng },
      { sortType },
      { searchType },
    ] as const,
  myActivityMarkingList: (activity: Activity) =>
    [...markingQueryKey.markingListAll(), { activity }] as const,
  myTemporaryMarkingList: () =>
    [...markingQueryKey.markingListAll(), "temporary"] as const,
  userMarkingList: (
    nickname: string,
    bounds: Bounds,
    latLng: LatLng,
    sortType: SortType,
  ) =>
    [
      ...markingQueryKey.markingListAll(),
      { nickname },
      { bounds },
      { latLng },
      { sortType },
    ] as const,
} as const;

export const markerQueryKey = {
  markerAll: () => ["marker"] as const,

  boundaryMarker: (bounds: Bounds) =>
    [...markerQueryKey.markerAll(), { bounds }] as const,
  myActivityMarker: (activity: Activity) =>
    [...markerQueryKey.markerAll(), { activity }] as const,
  myMarker: () => [...markerQueryKey.markerAll(), "myMarker"] as const,
  markerThumbnail: (nickname: string) =>
    [...markerQueryKey.markerAll(), "dashboard", { nickname }] as const,
};
