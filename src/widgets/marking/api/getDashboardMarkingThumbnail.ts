import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { Nickname } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_THUMBNAIL_ENDPOINT } from "../constants";

interface GetDashboardMarkingThumbnailRequest {
  nickname: Nickname;
  pageParams: number;
}

// TODO 타입 리팩토링 시 재사용 하기
interface MarkingThumbnailInfo {
  markingId: number;
  previewImage: string;
  lat: number;
  lng: number;
}

interface GetDashboardMarkingThumbnailResponse {
  marks: MarkingThumbnailInfo[];
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

export const useGetDashboardMarkingThumbnail = (
  nickname: GetDashboardMarkingThumbnailRequest["nickname"],
) => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery({
    queryKey: ["dashboardMarkingThumbnail", nickname],
    queryFn: token
      ? ({ pageParam = 0 }) =>
          apiClient.get<GetDashboardMarkingThumbnailResponse>(
            MARKING_THUMBNAIL_ENDPOINT.DASHBOARD(nickname, pageParam),
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
    select: ({ pages }) => pages.flatMap((page) => page.marks),
    initialPageParam: 0,
  });
};
