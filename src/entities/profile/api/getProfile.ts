import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { PROFILE_END_POINT } from "../constants";

// 유저 정보
type UserNickname = string;
type Followers = number[];
type Followings = number[];
type Likes = number[];
type Bookmarks = number[];
type TempCnt = number;

// 펫 프로필 정보
type PetName = string;
type Breed = string;
type PetDescription = string;
type Personalities = string[];
export type ProfileImageUrl = string;

export interface PetInfo {
  name: PetName;
  breed: Breed;
  description: PetDescription;
  personalities: Personalities;
  profile: ProfileImageUrl;
}

export interface MarkingPreviewData {
  id: number;
  image: string;
}

export interface UserInfo {
  nickname: UserNickname;
  pet: PetInfo | null;
  followers: Followers;
  followings: Followings;
  likes: Likes;
  bookmarks: Bookmarks;
  tempCnt: TempCnt;
  markings: MarkingPreviewData[];
}

interface ProfileRequestData {
  nickname: UserNickname;
}

export const getProfile = async ({ nickname }: ProfileRequestData) => {
  return apiClient.get<UserInfo>(PROFILE_END_POINT.PROFILE(nickname), {
    withToken: true,
  });
};

export const useGetProfile = ({
  nickname,
}: {
  nickname: UserNickname | null;
}) => {
  return useQuery({
    queryKey: ["profile", nickname],
    queryFn: nickname ? () => getProfile({ nickname }) : skipToken,
  });
};
