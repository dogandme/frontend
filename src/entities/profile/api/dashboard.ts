import { useQuery } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
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

interface ProfileRequest extends Pick<AuthStore, "token"> {
  nickname: string | null;
}

export const getProfile = async ({
  nickname,
  token,
}: ProfileRequest): Promise<ProfileResponse | null> => {
  if (!nickname) {
    return null;
  }

  const response = await fetch(PROFILE_END_POINT.PROFILE(nickname), {
    headers: {
      Authorization: token ?? "",
    },
  });
  const data: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const useGetProfile = ({ nickname, token }: ProfileRequest) => {
  return useQuery({
    queryKey: ["profile", nickname],
    queryFn: () => getProfile({ nickname, token }),

    enabled: !!nickname,
    staleTime: 1000 * 60 * 10, // 10분간 데이터는 캐시된 상태로 사용
    select: (data) => data?.content,
  });
};
