import { useQuery } from "@tanstack/react-query";
import { useResearchMarkingList } from "@/features/map/hooks";
import { useAuthStore } from "@/shared/store";
import { MARKING_REQUEST_URL } from "../constants/requestUrl";

interface Pet {
  petId: number;
  name: string;
  profile: string;
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

interface Pet {
  petId: number;
  name: string;
  profile: string;
}

interface Image {
  id: number;
  imageUrl: string;
  lank: number;
  regDt: string;
}

export interface Marking {
  markingId: number;
  region: string;
  content: string;
  isVisible: "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";
  regDt: string;
  userId: number;
  nickName: string;
  isOwner: boolean;
  isTempSaved: boolean;
  lat: number;
  lng: number;
  countData: Count;
  pet: Pet;
  images: Image[];
}

export interface MarkingListRequest {
  token: string | null;
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
}

interface MarkingListResponse {
  code: number;
  message: string;
  content: Marking[];
}

const getMarkingList = async ({
  token,
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
}: MarkingListRequest) => {
  const options: RequestInit = {
    method: "GET",
  };

  if (token) {
    options.headers = {
      Authorization: token,
    };
  }
  const response = await fetch(
    MARKING_REQUEST_URL.SEARCH_MARKING({
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    }),
    options,
  );

  const data: MarkingListResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const useGetMarkingList = () => {
  const token = useAuthStore((state) => state.token);

  const { bounds } = useResearchMarkingList();

  const southWestLat = bounds?.southWest.lat;
  const southWestLng = bounds?.southWest.lng;
  const northEastLat = bounds?.northEast.lat;
  const northEastLng = bounds?.northEast.lng;

  return useQuery<MarkingListResponse, Error, MarkingListResponse["content"]>({
    queryKey: [
      "markingList",
      token,
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],
    queryFn: () =>
      getMarkingList({
        token,
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      }),
    select: (data) => data.content,
    enabled:
      !!bounds &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng,
    refetchOnWindowFocus: false,
  });
};
