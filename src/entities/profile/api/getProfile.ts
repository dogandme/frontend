import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT, profileQueryKey } from "../constants";
import type { ProfileInfo } from "../types/server";

interface UseGetProfileParams {
  nickname: string | null;
}
type GetProfileRequest = NonNullableObject<UseGetProfileParams>;
type GetProfileResponse = ProfileInfo;

export const getProfile = ({ nickname }: GetProfileRequest) =>
  apiClient.get<GetProfileResponse>(PROFILE_END_POINT.PROFILE(nickname), {
    withToken: true,
    snackbarOnError: ({ code }) => code !== 404,
  });

export const useGetProfile = ({ nickname }: UseGetProfileParams) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<GetProfileResponse, HttpError>({
    queryKey: profileQueryKey.profile(nickname!),
    queryFn: nickname && token ? () => getProfile({ nickname }) : skipToken,
    gcTime: 0,
    throwOnError: (error) => error.code === 404,
  });
};

const makeIdsMap = (ids: number[]) => {
  return ids.reduce(
    (map, id) => {
      map[id] = true;
      return map;
    },
    {} as Record<number, boolean>,
  );
};

export const useGetMyProfile = () => {
  const token = useAuthStore((state) => state.token);
  const nickname = useAuthStore((state) => state.nickname);

  return useQuery({
    queryKey: profileQueryKey.profile(nickname!),
    queryFn: nickname && token ? () => getProfile({ nickname }) : skipToken,
    gcTime: 0,
    select: (data) => {
      const myFollowingIdsMap = makeIdsMap(data.followingsIds || []);
      const myBookmarkIdsMap = makeIdsMap(data.bookmarks || []);
      const myLikedIdsMap = makeIdsMap(data.likes || []);

      return {
        ...data,
        myFollowingIdsMap,
        myBookmarkIdsMap,
        myLikedIdsMap,
      };
    },
  });
};
