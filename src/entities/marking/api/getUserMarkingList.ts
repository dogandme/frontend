import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import type { Bounds, LatLng } from "@/entities/map/@x/marking";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking, SortType } from "../types/server";
import { markingQueryKey } from "./queryKey";

type UseGetUserMarkingListParams = Bounds & {
  nickname: string;
  sortType: SortType | null;
  filterData?: (data: Marking) => boolean;
};
type GetUserMarkingListRequest = Pick<UseGetUserMarkingListParams, "nickname"> &
  NonNullableObject<Bounds> &
  LatLng & {
    offset: number;
    sortType: NonNullable<UseGetUserMarkingListParams["sortType"]>;
  };

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
  filterData,
}: UseGetUserMarkingListParams) => {
  const token = useAuthStore.getState().token;

  const lat = useMapStore((state) => state.userInfo.currentLocation.lat);
  const lng = useMapStore((state) => state.userInfo.currentLocation.lng);

  const { isIdle: isMapIdle } = useMapStore.getState();

  return useInfiniteQuery({
    queryKey: markingQueryKey.userMarkingList(
      nickname,
      {
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      },
      { lat: lat!, lng: lng! },
      sortType!,
    ),

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
    select: (data) => {
      const flattenData = data.pages.flatMap((page) => page.markings);
      return filterData ? flattenData.filter(filterData) : flattenData;
    },

    refetchOnWindowFocus: false,

    gcTime: 0,
  });
};

export interface GetAllMarkingsOfUserRequest {
  nickname: string;
  sortType: Exclude<SortType, "DISTANCE">;
  offset: number;
  filterData?: (data: Marking) => boolean;
}

export const useGetAllMarkingsOfUser = ({
  nickname,
  sortType,
  filterData,
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
    select: (data) => {
      const flattenData = data.pages.flatMap((page) => page.markings);
      return filterData ? flattenData.filter(filterData) : flattenData;
    },

    refetchOnWindowFocus: false,

    gcTime: 0,
  });
};
