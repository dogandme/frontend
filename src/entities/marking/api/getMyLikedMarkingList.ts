import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import { markingQueryKey } from "./queryKey";
import type { Marking } from "./type";

export interface GetMyLikedMarkingListRequest {
  offset: number;
}

export interface GetMyLikedMarkingListResponse {
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

export const useGetMyLikedMarkingList = ({ enabled }: { enabled: boolean }) => {
  const { token } = useAuthStore.getState();

  return useInfiniteQuery({
    queryKey: markingQueryKey.myActivityMarkingList("LIKED"),
    queryFn:
      token && enabled
        ? ({ pageParam = 0 }) =>
            apiClient.get<GetMyLikedMarkingListResponse>(
              MARKING_END_POINT.MY_LIKED({ offset: pageParam }),
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
            imageUrl: `${API_BASE_URL}/markings/image/${data.markingId}/${imageUrl}`,
          })),
        })),
      ),
    refetchOnWindowFocus: false,
    gcTime: 0,
  });
};
