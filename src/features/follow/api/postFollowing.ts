import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nickname } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { FOLLOW_END_POINT } from "../constants";

export const usePostFollowing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: Nickname) =>
      apiClient.post(FOLLOW_END_POINT.POST_FOLLOWING(nickname), {
        withToken: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", useAuthStore.getState().nickname],
      });
    },
  });
};
