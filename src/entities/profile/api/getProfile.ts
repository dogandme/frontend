import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT, profileQueryKey } from "../constants";

export interface PetInfo {
  petId: number;
  name: string;
  breed: string;
  description: string | null;
  personalities: string[];
  profile: string | null;
}

export interface ProfileInfo {
  userId: number;
  nickname: string;
  socialType: "NAVER" | "GOOGLE" | "EMAIL" | null;
  followersIds: number[];
  followingsIds: number[];
  markings?: number[];

  // ROLE_USER 이상인 유저에게만 PetInfo 정보가 나타납니다.

  pet: PetInfo | null;

  // likes, bookmarks, tempCnt , markings는 본인의 페이지 일 때에만 나타납니다.

  likes?: number[];
  bookmarks?: number[];
  tempCnt?: number;
}

// 유저 정보
// TODO 병합 후 타입 제거하기
export type Nickname = string;
export type UserId = number;

interface GetProfileRequest {
  nickname: string;
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
