import { useQuery } from "@tanstack/react-query";
import { MARKING_REQUEST_URL } from "../contants/requestUrl";

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
  token?: string;
  southBottomLat: number;
  northTopLat: number;
  southLeftLng: number;
  northRightLng: number;
}

interface MarkingListResponse {
  code: number;
  message: string;
  content: Marking[];
}

const getMarkingList = async ({
  token,
  southBottomLat,
  northTopLat,
  southLeftLng,
  northRightLng,
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
      southBottomLat,
      northTopLat,
      southLeftLng,
      northRightLng,
    }),
    options,
  );

  const data: MarkingListResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const useGetMarkingList = ({
  token,
  southBottomLat,
  northTopLat,
  southLeftLng,
  northRightLng,
  hasAllParams,
}: MarkingListRequest & {
  hasAllParams: boolean;
}) => {
  return useQuery<MarkingListResponse, Error, MarkingListResponse["content"]>({
    queryKey: [
      "markingList",
      token,
      southBottomLat,
      northTopLat,
      southLeftLng,
      northRightLng,
    ],
    queryFn: () =>
      getMarkingList({
        token,
        southBottomLat,
        northTopLat,
        southLeftLng,
        northRightLng,
      }),
    select: (data) => data.content,
    enabled:
      hasAllParams &&
      !!southBottomLat &&
      !!northTopLat &&
      !!southLeftLng &&
      !!northRightLng,
  });
};
