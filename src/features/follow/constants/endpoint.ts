import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";

export const FOLLOW_END_POINT = {
  POST_FOLLOWING: (nickname: Nickname) =>
    `${API_BASE_URL}/users/follows/my-followings/${nickname}`,
  DELETE_FOLLOWING: (nickname: Nickname) =>
    `${API_BASE_URL}/users/follows/my-followings/${nickname}`,
  DELETE_FOLLOWER: (nickname: Nickname) =>
    `${API_BASE_URL}/users/follows/my-followers/${nickname}`,
};

export const MY_MARKING_ENDPOINT = {
  DELETE_TEMPORARY_MARKING: `${API_BASE_URL}/markings/temp`,
};
