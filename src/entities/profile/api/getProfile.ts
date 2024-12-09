import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT, profileQueryKey } from "../constants";
import type { ProfileInfo } from "./type";

// 유저 정보
// TODO 병합 후 타입 제거하기
export type Nickname = string;
export type UserId = number;
export type FollowerIdList = UserId[];
export type FollowingIdList = UserId[];

// 펫 프로필 정보
// TODO 병합 후 타입 제거하기
export type PetId = number;
export type PetName = string;
export type Breed = string;
export type PetPersonalities = string[];
export type PetDescription = string | null;
export type ProfileImageUrl = string | null;

// 마킹 정보
export type TemporarySavedMarkingCount = number;

interface GetProfileRequest {
  nickname: Nickname;
}

export const getProfile = ({ nickname }: GetProfileRequest) =>
  apiClient.get<ProfileInfo>(PROFILE_END_POINT.PROFILE(nickname), {
    withToken: true,
    snackbarOnError: ({ code }) => code !== 404,
  });

export const useGetProfile = ({ nickname }: { nickname: Nickname | null }) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<ProfileInfo, HttpError>({
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
