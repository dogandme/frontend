import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_REQUEST_URL } from "../constants";

export interface PostLikeMarkingRequestData {
  markingId: number;
}

const postLikeMarking = async ({ markingId }: PostLikeMarkingRequestData) => {
  return apiClient.post(MARKING_REQUEST_URL.LIKE(markingId), {
    withToken: true,
  });
};

export const usePostLikeMarking = () => {
  return useMutation<unknown, Error, PostLikeMarkingRequestData>({
    mutationFn: postLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
