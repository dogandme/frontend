import { useQuery } from "@tanstack/react-query";
import { PROFILE_END_POINT } from "../constants";

// 유저 정보
export type UserNickname = string;
export type Followers = number[];
export type Followings = number[];
export type Likes = number[];
export type Bookmarks = number[];
export type TempCnt = number;

// 펫 프로필 정보
export type PetName = string;
export type Breed = string;
export type Description = string;
export type Personalities = string[];
export type ProfileImageUrl = string;

export interface PetInfo {
  name: PetName;
  breed: Breed;
  description: Description;
  personalities: Personalities;
  profile: ProfileImageUrl;
}

export interface MarkingPreviewData {
  id: number;
  image: string;
}

export interface UserInfo {
  nickname: UserNickname;
  pet: PetInfo;
  followers: Followers;
  followings: Followings;
  likes: Likes;
  bookmarks: Bookmarks;
  tempCnt: TempCnt;
  markings: MarkingPreviewData[];
}

interface ProfileResponse {
  code: number;
  message: string;
  content: UserInfo;
}

export const getProfile = async (
  nickname: string,
): Promise<ProfileResponse> => {
  const response = await fetch(PROFILE_END_POINT.PROFILE(nickname));
  const data: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const useGetProfile = (nickname: string | null) => {
  return useQuery({
    queryKey: ["profile", nickname],
    queryFn: () => getProfile(nickname!),

    enabled: !!nickname,
    staleTime: 1000 * 60 * 10, // 10분간 데이터는 캐시된 상태로 사용
    select: (data) => data.content,
  });
};
