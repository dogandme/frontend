import { useMutation } from "@tanstack/react-query";
import { Nickname } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { FOLLOW_END_POINT } from "../constants";

export const usePostFollowing = () => {
  return useMutation({
    mutationFn: (nickname: Nickname) =>
      apiClient.post(FOLLOW_END_POINT.POST_FOLLOWING(nickname), {
        withToken: true,
      }),
  });
};
