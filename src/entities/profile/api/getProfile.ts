import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT } from "../constants";

// 유저 정보
export type Nickname = string;
type SocialType = "NAVER" | "GOOGLE" | "EMAIL";
type UserId = number;
export type FollowerList = UserId[];
export type FollowingList = UserId[];

// 펫 프로필 정보
export type PetName = string;
export type Breed = string;
export type PetDescription = string;
export type PetPersonalities = string[];
export type ProfileImageUrl = string;

type MarkingId = number;

// 마킹 정보
export type TemporarySavedMarkingCount = number;
type BookmarkMarkingList = MarkingId[];
type LikeMarkingList = MarkingId[];
type MarkingIdList = MarkingId[];

export interface PetInfo {
  name: PetName;
  breed: Breed;
  description: PetDescription | null;
  personalities: PetPersonalities | null;
  profile: ProfileImageUrl | null;
}

interface ProfileInfo {
  nickname: Nickname;
  socialType: SocialType | null;
  followers: FollowerList;
  followings: FollowingList;
  likes: LikeMarkingList;
  bookmarks: BookmarkMarkingList | null;
  tempCnt: TemporarySavedMarkingCount | null;
  markings: MarkingIdList | null;
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
