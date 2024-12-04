import { useEffect } from "react";
import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient, useInfiniteImageState } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import {
  MARKING_END_POINT,
  markingQueryKey,
  type MarkingVisibilityKey,
} from "../constants";

interface Address {
  id: number;
  province: string;
  cityCounty: string;
  district: string | null;
  subDistrict: string;
}

type PetName = string;
type Breed = string;
type PetDescription = string | null;
type ProfileImageUrl = string | null;
type PetPersonalities = string[];

interface Pet {
  petId: number;
  name: PetName;
  description: PetDescription;
  profile: ProfileImageUrl;
  breed: Breed;
  personalities: PetPersonalities;
}

interface Image {
  id: number;
  imageUrl: string;
  lank: number;
  regDt: string;
}

interface Count {
  likedCount: number;
  savedCount: number;
}

export interface Marking {
  markingId: number;
  region: string;
  content: string;
  isVisible: MarkingVisibilityKey;
  regDt: string;
  previewImage: string;
  userId: number;
  nickName: string;
  isOwner: boolean;
  isTempSaved: boolean;
  lat: number;
  lng: number;
  address: Address;
  countData: Count;
  pet: Pet;
  images: Image[];
}

export type SortType = "RECENT" | "DISTANCE" | "POPULARITY";
export type SearchType = "NEARBY" | "LOCATION";

export interface GetMarkingListRequest {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
  lat: number | null;
  lng: number | null;
  offset: number; // 페이지 번호
  sortType: SortType;
  searchType: SearchType;
}

// sort, paged, unpaged은 사용하지 x
interface GetMarkingListResponse {
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

interface UseGetMarkingListParams {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
  sortType: SortType | null;
  searchType: SearchType;
  filterData?: (data: Marking) => boolean;
}

export const useGetMarkingList = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  sortType,
  searchType,
  filterData,
}: UseGetMarkingListParams) => {
  const lat = useMapStore((state) => state.userInfo.currentLocation.lat);
  const lng = useMapStore((state) => state.userInfo.currentLocation.lng);

  const { isIdle: isMapIdle } = useMapStore.getState();

  return useInfiniteQuery({
    queryKey: markingQueryKey.boundaryMarkingList(
      {
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      },
      { lat: lat!, lng: lng! },
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

export const useGetMarkingThumbnailList = (params: UseGetMarkingListParams) => {
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
