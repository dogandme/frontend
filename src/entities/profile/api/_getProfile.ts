/**
 * 충돌을 방지하기 위해 만든 파일입니다.
 * 추후에는 리팩토링을 마친 getProfile.ts 옮겨야 합니다.
 */
import { skipToken, useQuery } from "@tanstack/react-query";
import { AuthStore, useAuthStore } from "@/shared/store";
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
  description?: PetDescription;
  personalities?: Personalities;
  profile?: ProfileImageUrl;
}

export interface ProfileInfo {
  nickname?: Nickname;
  socialType: SocialType;
  followers: FollowerList;
  followings: FollowingList;
  likes: LikeMarkingList;
  bookmarks: BookmarkMarkingList;
  tempCnt: TempCnt;
  markings?: MarkingList;
}

interface GetProfileResponseData extends ProfileInfo, Partial<PetInfo> {}
interface GetProfileRequestData {
  nickname?: Nickname;
}

// TODO apiClient 를 이용하여 변경하기
const getProfile = async ({
  nickname,
  token,
}: {
  nickname: NonNullable<GetProfileRequestData["nickname"]>;
  token: NonNullable<AuthStore["token"]>;
}) => {
  const response = await fetch(PROFILE_END_POINT.PROFILE(nickname), {
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data as GetProfileResponseData;
};

export const useGetProfile = ({ nickname }: GetProfileRequestData) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["profile", nickname],
    queryFn:
      nickname && token ? () => getProfile({ nickname, token }) : skipToken,
    gcTime: 0,
  });
};
