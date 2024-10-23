import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SEARCH_MARKING_END_POINT } from "../constants";

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

export interface GetMarkingListRequest {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
  lat: number;
  lng: number;
  offset: number; // 페이지 번호
  sortType: "RECENT" | "DISTANCE" | "POPULARITY"; // 정렬 기준
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
    SEARCH_MARKING_END_POINT({
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
  southWestLat?: number;
  southWestLng?: number;
  northEastLat?: number;
  northEastLng?: number;
} & Pick<GetMarkingListRequest, "sortType">) => {
  const map = useMap();
  const mapCenter = map?.getCenter();

  const lat = mapCenter?.lat();
  const lng = mapCenter?.lng();

  return useInfiniteQuery({
    queryKey: [
      "markingList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],

    queryFn:
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng &&
      !!lat &&
      !!lng
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

    getNextPageParam: (lastPage) => {
      const {
        pageAble: { pageNumber },
        totalPages,
      } = lastPage;

      return pageNumber < totalPages ? pageNumber + 1 : null;
    },
    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.markings),

    refetchOnWindowFocus: false,
  });
};
