import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostSaveMarkingRequest {
  markingId: number;
}

const postSaveMarking = async ({ markingId }: PostSaveMarkingRequest) => {
  return apiClient.post(MARKING_END_POINT.SAVE(markingId), {
    withToken: true,
  });
};

export const usePostSaveMarking = () => {
  return useMutation<unknown, Error, PostSaveMarkingRequest>({
    mutationFn: postSaveMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
