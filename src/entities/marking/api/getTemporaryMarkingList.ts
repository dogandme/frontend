import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { Nickname, UserId } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MY_MARKING_ENDPOINT } from "../constants";

// TODO 타입 스크립트 리팩토링 시 변경 하기
export interface TempMarkingInfo {
  markingId: number;
  region: string;
  content: string | null;
  isVisible: "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";
  regDt: string;
  previewImage: string | null;
  userId: UserId;
  nickname: Nickname;
  isOwner: true;
  isTempSaved: true;
  lat: number;
  lng: number;
  address: {
    id: number;
    province: string;
    cityCounty: string;
    district: string | null;
    subDistrict: string;
  };
  countData: {
    likedCount: 0;
    savedCount: 0;
  };
  images: string[];
}

export interface GetTemporaryMarkingListResponse {
  markings: TempMarkingInfo[];
  totalElements: number;
  totalPages: number;
  pageAble: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export const useGetTemporaryMarkingList = () => {
  const token = useAuthStore((state) => state.token);
  return useInfiniteQuery({
    queryKey: ["temporaryMarkingList"],
    queryFn: token
      ? ({ pageParam }: { pageParam: number }) =>
          apiClient.get<GetTemporaryMarkingListResponse>(
            MY_MARKING_ENDPOINT.TEMPORARY(pageParam),
            {
              withToken: true,
            },
          )
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages ? pageAble.pageNumber + 1 : null;
    },
    initialPageParam: 0,
  });
};
