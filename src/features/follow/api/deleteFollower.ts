import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { FOLLOW_END_POINT } from "../constants";

export const useDeleteFollower = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      apiClient.delete(FOLLOW_END_POINT.DELETE_FOLLOWER(nickname), {
        withToken: true,
      }),
  });
};
