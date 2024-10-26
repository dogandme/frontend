import { useMutation } from "@tanstack/react-query";
import { Nickname } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { FOLLOW_END_POINT } from "../constants";

interface DeleteFollowerRequest {
  nickname: Nickname;
}

export const useDeleteFollower = () => {
  return useMutation({
    mutationFn: (nickname: DeleteFollowerRequest["nickname"]) =>
      apiClient.delete(FOLLOW_END_POINT.DELETE_FOLLOWER(nickname), {
        withToken: true,
      }),
  });
};
