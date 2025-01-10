import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markingQueryKey } from "@/entities/marking/api";
import type { Marking } from "@/entities/marking/types/server";
import { profileQueryKey } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostLikeMarkingRequest {
  markingId: Marking["markingId"];
}

export const usePostLikeMarking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ markingId }: PostLikeMarkingRequest) =>
      apiClient.post(MARKING_END_POINT.LIKE(markingId), {
        withToken: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          profileQueryKey.myProfile(),
          markingQueryKey.myActivityMarkingList("SAVED"),
          markingQueryKey.myActivityMarkingList("LIKED"),
        ],
      });
    },
  });
};
