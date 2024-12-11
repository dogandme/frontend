import { useEffect } from "react";
import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import type { Bounds, LatLng } from "@/entities/map/@x/marking";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient, useInfiniteImageState } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking, SearchType, SortType } from "../types/server";
import { markingQueryKey } from "./queryKey";

type UseGetMarkingListParams = Bounds &
  LatLng & {
    sortType: SortType | null;
    searchType: SearchType;
    filterData?: (data: Marking) => boolean;
  };
type GetMarkingListRequest = Pick<
  UseGetMarkingListParams,
  "searchType" | "lat" | "lng"
> &
  NonNullableObject<Bounds> &
  LatLng & {
    sortType: NonNullable<UseGetMarkingListParams["sortType"]>;
    offset: number;
  };

export interface GetMarkingListResponse {
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

const getMarkingList = async ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  lat,
  lng,
  sortType,
  searchType,
  offset,
}: GetMarkingListRequest) => {
  const hasToken = !!useAuthStore.getState().token;

  return apiClient.get<GetMarkingListResponse>(
    MARKING_END_POINT.BOUNDARY({
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
      lat,
      lng,
      sortType,
      searchType,
      offset,
    }),
    {
      withToken: hasToken,
    },
  );
};

export const useGetMarkingList = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  lat,
  lng,
  sortType,
  searchType,
  filterData,
}: UseGetMarkingListParams) => {
  const { isIdle: isMapIdle } = useMapStore.getState();

  return useInfiniteQuery({
    queryKey: markingQueryKey.boundaryMarkingList(
      {
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      },
      { lat, lng },
      sortType!,
      searchType,
    ),

    queryFn:
      isMapIdle &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng &&
      !!sortType
        ? ({ pageParam }) =>
            getMarkingList({
              southWestLat,
              southWestLng,
              northEastLat,
              northEastLng,
              lat,
              lng,
              offset: pageParam,
              sortType,
              searchType,
            })
        : skipToken,

    getNextPageParam: ({ pageAble: { pageNumber }, totalPages }) => {
      return pageNumber < totalPages - 1 ? pageNumber + 1 : null;
    },

    initialPageParam: 0,

    select: (data) => {
      const flattenData = data.pages.flatMap(({ markings }) =>
        markings.map((data) => ({
          ...data,
          previewImage: `${API_BASE_URL}/markings/image/preview/${data.markingId}/${data.previewImage}`,
          images: data.images.map(({ imageUrl, ...rest }) => ({
            ...rest,
            imageUrl: `${API_BASE_URL}/markings/image/${data.markingId}/${imageUrl}`,
          })),
        })),
      );
      return filterData ? flattenData.filter(filterData) : flattenData;
    },

    refetchOnWindowFocus: false,
    gcTime: 0,
  });
};

export const useGetMarkingThumbnailList = (params: GetMarkingListRequest) => {
  const { loadImage, isFirstPageImageLoading, isImageLoading, imageState } =
    useInfiniteImageState();
  const { data, isLoading, isFetchingNextPage, ...rest } =
    useGetMarkingList(params);

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
