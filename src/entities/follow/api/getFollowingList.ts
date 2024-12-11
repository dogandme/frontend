import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { FOLLOW_END_POINT, followQueryKey } from "../constants";
import type { FollowUserInfo } from "../types/server";

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

interface GetFollowingListRequest extends UseGetFollowerListParams {
  pageParam?: number;
}

interface GetFollowingListResponse extends PageAbleInformation {
  userInfos: FollowUserInfo[];
}

const getFollowingList = ({
  pageParam = 0,
  nickname,
}: GetFollowingListRequest) => {
  return apiClient.get<GetFollowingListResponse>(
    FOLLOW_END_POINT.FOLLOWING_LIST(nickname, pageParam),
    {
      withToken: true,
    },
  );
};

export const useGetFollowingList = ({ nickname }: UseGetFollowerListParams) => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery({
    queryKey: followQueryKey.following(nickname),
    queryFn: token
      ? ({ pageParam = 0 }) => getFollowingList({ nickname, pageParam })
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) =>
      pageAble.pageNumber < totalPages - 1 ? pageAble.pageNumber + 1 : null,
    initialPageParam: 0,
    select: ({ pages }) => pages.flatMap((page) => page.userInfos),
  });
};
