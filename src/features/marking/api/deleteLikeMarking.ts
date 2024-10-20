import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteLikeMarkingRequestData {
  markingId: number;
}

const deleteLikeMarking = async ({
  markingId,
}: DeleteLikeMarkingRequestData) => {
  return apiClient.delete(MARKING_END_POINT.LIKE(markingId), {
    withToken: true,
  });
};

export const useDeleteLikeMarking = () => {
  return useMutation<unknown, Error, DeleteLikeMarkingRequestData>({
    mutationFn: deleteLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
