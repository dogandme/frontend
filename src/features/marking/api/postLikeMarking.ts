import { useMutation } from "@tanstack/react-query";
import type { Marking } from "@/entities/marking/types/server";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostLikeMarkingRequest {
  markingId: Marking["markingId"];
}

export const usePostLikeMarking = () => {
  return useMutation({
    mutationFn: ({ markingId }: PostLikeMarkingRequest) =>
      apiClient.post(MARKING_END_POINT.LIKE(markingId), {
        withToken: true,
      }),
  });
};
