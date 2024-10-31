import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT } from "../constants";

// 유저 정보
export type Nickname = string;
type SocialType = "NAVER" | "GOOGLE" | "EMAIL";
type UserId = number;
export type FollowerIdList = UserId[];
export type FollowingIdList = UserId[];

// 펫 프로필 정보
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
  });

export const useGetProfile = ({ nickname }: { nickname: Nickname | null }) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<GetProfileResponse, HttpError>({
    queryKey: ["profile", nickname],
    queryFn: nickname && token ? () => getProfile({ nickname }) : skipToken,
    gcTime: 0,
  });
};
