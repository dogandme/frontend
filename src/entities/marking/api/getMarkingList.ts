import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SEARCH_MARKING_END_POINT } from "../constants";

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
    SEARCH_MARKING_END_POINT({
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

export const useGetMarkingList = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
}: {
  southWestLat?: number;
  southWestLng?: number;
  northEastLat?: number;
  northEastLng?: number;
}) => {
  return useQuery({
    queryKey: [
      "markingList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],
    queryFn:
      !!southWestLat && !!southWestLng && !!northEastLat && !!northEastLng
        ? () =>
            getMarkingList({
              southWestLat,
              southWestLng,
              northEastLat,
              northEastLng,
            })
        : skipToken,
    refetchOnWindowFocus: false,
  });
};
