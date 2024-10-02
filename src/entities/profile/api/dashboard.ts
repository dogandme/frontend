import { useQuery } from "@tanstack/react-query";
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
type ProfileImageUrl = string;

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
