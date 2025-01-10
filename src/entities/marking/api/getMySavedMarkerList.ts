import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking } from "../types/server";
import { markingQueryKey } from "./queryKey";

interface UseGetMySavedMarkingListParams {
  enabled: boolean;
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

export const useGetMySavedMarkingList = ({
  enabled,
}: UseGetMySavedMarkingListParams) => {
  const { token } = useAuthStore.getState();

  return useInfiniteQuery({
    queryKey: markingQueryKey.myActivityMarkingList("SAVED"),
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
    select: (data) =>
      data.pages.flatMap(({ markings }) =>
        markings.map(({ images, ...data }) => ({
          ...data,
          images: images.map(({ imageUrl, ...rest }) => ({
            ...rest,
            imageUrl: import.meta.env.DEV
              ? imageUrl
              : `${API_BASE_URL}/markings/image/${data.markingId}/${imageUrl}`,
          })),
        })),
      ),

    enabled,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });
};
