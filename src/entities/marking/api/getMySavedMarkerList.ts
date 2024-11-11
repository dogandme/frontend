import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking } from "./getMarkingList";

export interface GetMySavedMarkingListRequest {
  offset: number;
}

export interface GetMySavedMarkingListResponse {
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

export const useGetMySavedMarkingList = ({ enabled }: { enabled: boolean }) => {
  const { token } = useAuthStore.getState();

  return useInfiniteQuery({
    queryKey: ["markingList", "mySavedMarkingList"],
    queryFn:
      token && enabled
        ? ({ pageParam = 0 }) =>
            apiClient.get<GetMySavedMarkingListResponse>(
              MARKING_END_POINT.MY_SAVED({ offset: pageParam }),
              {
                withToken: true,
              },
            )
        : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages - 1
        ? pageAble.pageNumber + 1
        : null;
    },
    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.markings),

    enabled,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });
};
