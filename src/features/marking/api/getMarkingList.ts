import { useQuery } from "@tanstack/react-query";
import { useResearchMarkingList } from "@/features/map/hooks";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants/endPoint";

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

export interface GetMarkingListRequest {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
}

const getMarkingList = async ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
}: GetMarkingListRequest) => {
  const hasToken = !!useAuthStore.getState().token;

  return apiClient.get<Marking[]>(
    MARKING_END_POINT.SEARCH_MARKING({
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    }),
    {
      withToken: hasToken,
    },
  );
};

export const useGetMarkingList = () => {
  const { bounds } = useResearchMarkingList();

  const southWestLat = bounds?.southWest.lat;
  const southWestLng = bounds?.southWest.lng;
  const northEastLat = bounds?.northEast.lat;
  const northEastLng = bounds?.northEast.lng;

  return useQuery({
    queryKey: [
      "markingList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],
    queryFn: () =>
      getMarkingList({
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      }),
    enabled:
      !!bounds &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng,
    refetchOnWindowFocus: false,
  });
};
