import { API_BASE_URL } from "@/shared/constants";

export const FOLLOW_ENDPOINT = {
  FOLLOWER_LIST: (nickname: string, offset: number) =>
    `${API_BASE_URL}/users/follows/followers/${nickname}?offset=${offset}`,
  FOLLOWING_LIST: (nickname: string, offset: number) =>
    `${API_BASE_URL}/users/follows/followings/${nickname}?offset=${offset}`,
};
