import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { FOLLOW_END_POINT } from "../constants";
import type { FollowUserInfo } from "../types/server";
import { followQueryKey } from "./queryKey";

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

interface UseGetFollowerListParams {
  nickname: string;
}

interface GetFollowerListRequest extends UseGetFollowerListParams {
  pageParam?: number;
}

interface GetFollowerListResponse extends PageAbleInformation {
  userInfos: FollowUserInfo[];
}

const getFollowerList = ({
  pageParam = 0,
  nickname,
}: GetFollowerListRequest) => {
  return apiClient.get<GetFollowerListResponse>(
    FOLLOW_END_POINT.FOLLOWER_LIST(nickname, pageParam),
    {
      withToken: true,
    },
  );
};

export const useGetFollowerList = ({ nickname }: UseGetFollowerListParams) => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery({
    queryKey: followQueryKey.follower(nickname),
    queryFn: token
      ? ({ pageParam = 0 }) => getFollowerList({ nickname, pageParam })
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages - 1
        ? pageAble.pageNumber + 1
        : null;
    },
    initialPageParam: 0,
    select: ({ pages }) => pages.flatMap((page) => page.userInfos),
  });
};
