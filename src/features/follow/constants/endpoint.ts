import { API_BASE_URL } from "@/shared/constants";

export const FOLLOW_END_POINT = {
  POST_FOLLOWING: (nickname: string) =>
    `${API_BASE_URL}/users/follows/my-followings/${nickname}`,
  DELETE_FOLLOWING: (nickname: string) =>
    `${API_BASE_URL}/users/follows/my-followings/${nickname}`,
  DELETE_FOLLOWER: (nickname: string) =>
    `${API_BASE_URL}/users/follows/my-followers/${nickname}`,
};
