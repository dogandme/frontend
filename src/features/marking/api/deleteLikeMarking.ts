import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteLikeMarkingRequest {
  markingId: number;
}

const deleteLikeMarking = async ({ markingId }: DeleteLikeMarkingRequest) => {
  return apiClient.delete(MARKING_END_POINT.LIKE(markingId), {
    withToken: true,
  });
};

export const useDeleteLikeMarking = () => {
  return useMutation<unknown, Error, DeleteLikeMarkingRequest>({
    mutationFn: deleteLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
