import { useQuery } from "@tanstack/react-query";
import { END_POINT } from "../constants";

interface PetInformation {
  name: string;
  breed: string;
  description: string;
  personalities: [];
  profile: string;
}

interface ProfileResponse {
  code: number;
  message: string;
  content: {
    nickname: string;
    pet: PetInformation;
    followers: number[];
    followings: number[];
    likes: number[];
    bookmarks: number[];
    tempCnt: number;
  };
}

export const getProfile = async (
  nickname: string,
): Promise<ProfileResponse> => {
  const response = await fetch(END_POINT.PROFILE(nickname));
  const data: ProfileResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const useGetProfile = (nickname: string) => {
  return useQuery({
    queryKey: ["profile", nickname],
    queryFn: () => getProfile(nickname),

    enabled: !!nickname,
  });
};
