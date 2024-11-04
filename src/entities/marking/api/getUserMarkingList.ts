import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type {
  GetMarkingListRequest,
  Marking,
  SortType,
} from "./getMarkingList";

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

export type GetUserMarkingListRequest = GetMarkingListRequest & {
  nickname: string;
};

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
