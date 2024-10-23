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

interface GetFollowerListRequest {
  nickname: Nickname;
}

type GetFollowerListResponse = {
  userInfos: {
    userId: UserId;
    nickname: Nickname;
    pet: PetInfo;
  }[];
} & PageAbleInformation;

const getFollowerList = ({
  pageParam = 0,
  nickname,
}: GetFollowerListRequest & { pageParam: number }) => {
  return apiClient.get<GetFollowerListResponse>(
    FOLLOW_ENDPOINT.FOLLOWER_LIST(nickname, pageParam),
  );
};

export const useGetFollowerList = ({ nickname }: GetFollowerListRequest) => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery({
    queryKey: ["followerList", nickname],
    queryFn: token
      ? ({ pageParam = 0 }) => getFollowerList({ nickname, pageParam })
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages ? pageAble.pageNumber + 1 : null;
    },
    initialPageParam: 0,
    select: ({ pages }) => pages.flatMap((page) => page.userInfos),
  });
};
