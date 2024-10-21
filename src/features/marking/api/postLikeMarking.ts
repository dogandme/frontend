import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostLikeMarkingRequest {
  markingId: number;
}

const postLikeMarking = async ({ markingId }: PostLikeMarkingRequest) => {
  return apiClient.post(MARKING_END_POINT.LIKE(markingId), {
    withToken: true,
  });
};

export const usePostLikeMarking = () => {
  return useMutation<unknown, Error, PostLikeMarkingRequest>({
    mutationFn: postLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
