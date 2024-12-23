import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileQueryKey } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { FOLLOW_END_POINT } from "../constants";

export const useDeleteFollowing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => {
      return apiClient.delete(FOLLOW_END_POINT.DELETE_FOLLOWING(nickname), {
        withToken: true,
      });
    },
    onSuccess: (_data, nickname) => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKey.profile(nickname),
      });

      queryClient.invalidateQueries({
        queryKey: profileQueryKey.myProfile(),
      });
    },
  });
};
