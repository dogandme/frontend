import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
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

interface ProfileResponse {
  code: number;
  message: string;
  content: UserInfo;
}

interface ProfileRequest {
  token: NonNullable<AuthStore["token"]>;
  nickname: UserNickname;
}

export const getProfile = async ({
  nickname,
  token,
}: ProfileRequest): Promise<ProfileResponse> => {
  const response = await fetch(PROFILE_END_POINT.PROFILE(nickname), {
    headers: {
      Authorization: token,
    },
  });

  const data: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const useGetProfile = ({
  nickname,
  token,
}: {
  nickname: UserNickname | null;
  token: AuthStore["token"];
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["profile", nickname, token],
    queryFn:
      nickname && token ? () => getProfile({ nickname, token }) : skipToken,
    placeholderData: () => {
      const cachedData = queryClient.getQueryData<ProfileResponse>([
        "profile",
        nickname,
        token,
      ]);
      return cachedData;
    },
    select: (data) => data?.content,
  });
};
