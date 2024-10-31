import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";

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
  isVisible: "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";
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

export interface GetMarkingListRequest {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
  lat: number;
  lng: number;
  offset: number; // 페이지 번호
  sortType: SortType;
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
  sortType,
}: {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
  sortType: SortType | null;
}) => {
  const lat = useMapStore((state) => state.userInfo.currentLocation.lat);
  const lng = useMapStore((state) => state.userInfo.currentLocation.lng);

  const { isIdle: isMapIdle } = useMapStore.getState();

  return useInfiniteQuery({
    queryKey: [
      "markingList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
      sortType,
    ],

    queryFn:
      isMapIdle &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng &&
      !!lat &&
      !!lng &&
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
