import { useEffect } from "react";
import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient, useInfiniteImageState } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_THUMBNAIL_END_POINT } from "../constants";
import type { Marker } from "../types/server";
import { markerQueryKey } from "./queryKey";

interface GetDashboardMarkingThumbnailRequest {
  nickname: string;
}

interface GetDashboardMarkingThumbnailResponse {
  marks: Marker[];
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

export const useGetDashboardMarkingThumbnail = ({
  nickname,
}: GetDashboardMarkingThumbnailRequest) => {
  const token = useAuthStore((state) => state.token);
  const { loadImage, isImageLoading, isFirstPageImageLoading, imageState } =
    useInfiniteImageState();

  const { data, isLoading, isFetchingNextPage, ...rest } = useInfiniteQuery({
    queryKey: markerQueryKey.markerThumbnail(nickname),
    queryFn: token
      ? ({ pageParam = 0 }) =>
          apiClient.get<GetDashboardMarkingThumbnailResponse>(
            MARKING_THUMBNAIL_END_POINT.DASHBOARD(nickname, pageParam),
            {
              withToken: true,
            },
          )
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) =>
      pageAble.pageNumber < totalPages - 1 ? pageAble.pageNumber + 1 : null,
    select: ({ pages }) =>
      pages.flatMap(({ marks }) =>
        marks.map((data) => ({
          ...data,
          previewImage: `${API_BASE_URL}/markings/image/preview/${data.markingId}/${data.previewImage}`,
        })),
      ),
    initialPageParam: 0,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    loadImage(data.map(({ previewImage }) => previewImage));
  }, [data]);

  return {
    data: data
      ?.filter(({ previewImage }) => imageState[previewImage])
      .map((data) => ({
        ...data,
        previewImageIsSuccess: imageState[data.previewImage].isSuccess,
      })),
    isLoading: isLoading || isFirstPageImageLoading,
    isFetchingNextPage: isFetchingNextPage || isImageLoading,
    ...rest,
  };
};
