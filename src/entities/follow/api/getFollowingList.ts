import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import type { Nickname, PetInfo, UserId } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { FOLLOW_ENDPOINT } from "../constants";

// TODO 리팩토링 시 해당 타입 정의 위치 의논
interface PageAbleInformation {
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
    offset: number;
    unPaged: boolean;
    paged: boolean;
  };
}

interface GetFollowingListRequest {
  nickname: Nickname;
}

type GetFollowingListResponse = {
  userInfos: {
    userId: UserId;
    nickname: Nickname;
    pet: PetInfo | null;
  }[];
} & PageAbleInformation;

const getFollowingList = async ({
  pageParam = 0,
  nickname,
}: GetFollowingListRequest & { pageParam: number }) => {
  return apiClient.get<GetFollowingListResponse>(
    FOLLOW_ENDPOINT.FOLLOWING_LIST(nickname, pageParam),
  );
};

export const useGetFollowingList = ({ nickname }: GetFollowingListRequest) => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery({
    queryKey: ["followingList", nickname],
    queryFn: token
      ? ({ pageParam = 0 }) => getFollowingList({ nickname, pageParam })
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages ? pageAble.pageNumber + 1 : null;
    },
    initialPageParam: 0,
    select: ({ pages }) => pages.flatMap((page) => page.userInfos),
  });
};
