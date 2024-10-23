import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { PROFILE_END_POINT } from "../constants";

// 유저 정보
type Nickname = string;
type SocialType = "NAVER" | "GOOGLE" | "EMAIL";
type UserId = number;
type FollowerList = UserId[];
type FollowingList = UserId[];

// 펫 프로필 정보
type PetName = string;
type Breed = string;
type PetDescription = string;
type Personalities = string[];
export type ProfileImageUrl = string;

type MarkingId = number;

// 마킹 정보
type TempCnt = number;
type BookmarkMarkingList = MarkingId[];
type LikeMarkingList = MarkingId[];
type MarkingList = MarkingId[];

interface PetInfo {
  name: PetName;
  breed: Breed;
  description: PetDescription | null;
  personalities: Personalities | null;
  profile: ProfileImageUrl | null;
}

export interface ProfileInfo {
  nickname: Nickname;
  socialType: SocialType;
  followers: FollowerList;
  followings: FollowingList;
  likes: LikeMarkingList;
  bookmarks: BookmarkMarkingList;
  tempCnt: TempCnt;
  markings: MarkingList;
}

type GetProfileResponse = ProfileInfo & {
  pet: PetInfo | null;
};

interface GetProfileRequest {
  nickname: Nickname;
}

export const getProfile = ({
  nickname,
}: GetProfileRequest): Promise<GetProfileResponse> =>
  apiClient.get(PROFILE_END_POINT.PROFILE(nickname), {
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
