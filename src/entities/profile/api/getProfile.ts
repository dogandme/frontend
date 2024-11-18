import { useParams } from "react-router-dom";
import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT, profileQueryKey } from "../constants";

// 유저 정보
export type Nickname = string;
type SocialType = "NAVER" | "GOOGLE" | "EMAIL";
export type UserId = number;
export type FollowerIdList = UserId[];
export type FollowingIdList = UserId[];

// 펫 프로필 정보
export type PetId = number;
export type PetName = string;
export type Breed = string;
export type PetPersonalities = string[];
export type PetDescription = string | null;
export type ProfileImageUrl = string | null;

type MarkingId = number;

// 마킹 정보
export type TemporarySavedMarkingCount = number;
type BookmarkMarkingList = MarkingId[];
type LikeMarkingList = MarkingId[];
type MarkingIdList = MarkingId[];

export interface PetInfo {
  petId: PetId;
  name: PetName;
  breed: Breed;
  description: PetDescription;
  personalities: PetPersonalities;
  profile: ProfileImageUrl;
}

/**
 * likes, bookmarks, tempCnt , markings는 본인의 페이지 일 때에만 나타납니다.
 */
interface ProfileInfo {
  userId: UserId;
  nickname: Nickname;
  socialType: SocialType | null;
  followersIds: FollowerIdList;
  followingsIds: FollowingIdList;
  likes?: LikeMarkingList;
  bookmarks?: BookmarkMarkingList;
  tempCnt?: TemporarySavedMarkingCount;
  markings?: MarkingIdList;
}

export type GetProfileResponse = ProfileInfo & {
  pet: PetInfo | null;
};

interface GetProfileRequest {
  nickname: Nickname;
}

export const getProfile = ({ nickname }: GetProfileRequest) =>
  apiClient.get<GetProfileResponse>(PROFILE_END_POINT.PROFILE(nickname), {
    withToken: true,
    snackbarOnError: ({ code }) => code !== 404,
  });

export const useGetProfile = ({ nickname }: { nickname: Nickname | null }) => {
  const token = useAuthStore((state) => state.token);
  const { nickname: nicknameParams } = useParams<{ nickname: string }>();

  return useQuery<GetProfileResponse, HttpError>({
    queryKey: profileQueryKey.profile(nickname!),
    queryFn: nickname && token ? () => getProfile({ nickname }) : skipToken,
    gcTime: 0,
    throwOnError: (error) =>
      error.code === 404 && !!nicknameParams?.startsWith("@"),
  });
};

export const useGetMyProfile = <TResult = GetProfileResponse>(
  select: (data: GetProfileResponse) => TResult,
) => {
  const token = useAuthStore((state) => state.token);
  const nickname = useAuthStore((state) => state.nickname);

  return useQuery({
    queryKey: profileQueryKey.profile(nickname!),
    queryFn: nickname && token ? () => getProfile({ nickname }) : skipToken,
    gcTime: 0,
    select,
  });
};

export const useGetMyFollowingIdsMap = () => {
  return useGetMyProfile((data) => {
    const followingsIds = data?.followingsIds || [];
    return followingsIds.reduce(
      (map, id) => {
        map[id] = true;
        return map;
      },
      {} as Record<UserId, boolean>,
    );
  });
};

export const useGetMyBookmarkIdsMap = () => {
  return useGetMyProfile((data) => {
    const bookmarks = data?.bookmarks || [];

    return bookmarks.reduce(
      (map, id) => {
        map[id] = true;
        return map;
      },
      {} as Record<number, boolean>,
    );
  });
};

export const useGetMyLikedIdsMap = () => {
  return useGetMyProfile((data) => {
    const likes = data?.likes || [];

    return likes.reduce(
      (map, id) => {
        map[id] = true;
        return map;
      },
      {} as Record<number, boolean>,
    );
  });
};
