import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteMarkingRequest {
  markingId: number;
}

const deleteMarking = async ({ markingId }: DeleteMarkingRequest) => {
  return apiClient.delete(MARKING_END_POINT.DELETE, {
    withToken: true,
    body: { markingId },
  });
};

export const useDeleteMarking = () => {
  return useMutation<unknown, Error, DeleteMarkingRequest>({
    mutationFn: deleteMarking,
    onSuccess: () => {
      // todo 기존에 캐시된 내 마킹 데이터 삭제하기
    },
  });
};
