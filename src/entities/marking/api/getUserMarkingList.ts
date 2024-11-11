import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking, SortType } from "./getMarkingList";

export interface GetUserMarkingListRequest {
  nickname: string;
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
  lat: number | null;
  lng: number | null;
  offset: number; // 페이지 번호
  sortType: SortType;
}

interface GetUserMarkingListResponse {
  markings: Marking[];
  totalElements: number;
  totalPages: number;
  pageAble: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
}

const getUserMarkingList = async ({
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
  return apiClient.get<GetUserMarkingListResponse>(
    MARKING_END_POINT.USER({
      nickname,
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
      lat,
      lng,
      sortType,
      offset,
    }),
    {
      withToken: true,
    },
  );
};

export const useGetUserMarkingList = ({
  nickname,
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  sortType,
}: {
  nickname: string;
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
  sortType: SortType | null;
}) => {
  const token = useAuthStore.getState().token;

  const lat = useMapStore((state) => state.userInfo.currentLocation.lat);
  const lng = useMapStore((state) => state.userInfo.currentLocation.lng);

  const { isIdle: isMapIdle } = useMapStore.getState();

  return useInfiniteQuery({
    queryKey: [
      nickname,
      "markingList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
      sortType,
    ],

    queryFn:
      token &&
      isMapIdle &&
      !!nickname &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng &&
      !!sortType
        ? ({ pageParam }) =>
            getUserMarkingList({
              nickname,
              southWestLat,
              southWestLng,
              northEastLat,
              northEastLng,
              lat,
              lng,
              offset: pageParam,
              sortType,
            })
        : skipToken,

    getNextPageParam: ({ pageAble: { pageNumber }, totalPages }) => {
      return pageNumber < totalPages - 1 ? pageNumber + 1 : null;
    },
    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.markings),

    refetchOnWindowFocus: false,

    gcTime: 0,
  });
};

export interface GetAllMarkingsOfUserRequest {
  nickname: string;
  sortType: Exclude<SortType, "DISTANCE">;
  offset: number;
}

export const useGetAllMarkingsOfUser = ({
  nickname,
  sortType,
}: Omit<GetAllMarkingsOfUserRequest, "offset">) => {
  const token = useAuthStore.getState().token;

  return useInfiniteQuery({
    queryKey: [nickname, "markingList", null, null, null, null, sortType],

    queryFn:
      token && !!nickname && !!sortType
        ? ({ pageParam }) =>
            apiClient.get<GetUserMarkingListResponse>(
              MARKING_END_POINT.ALL_MARKINGS_OF_USER({
                nickname,
                sortType,
                offset: pageParam,
              }),
              {
                withToken: true,
              },
            )
        : skipToken,

    getNextPageParam: ({ pageAble: { pageNumber }, totalPages }) => {
      return pageNumber < totalPages - 1 ? pageNumber + 1 : null;
    },
    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.markings),

    refetchOnWindowFocus: false,

    gcTime: 0,
  });
};
