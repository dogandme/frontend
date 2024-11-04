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

export const useDeleteMarking = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation<unknown, Error, DeleteMarkingRequest>({
    mutationFn: deleteMarking,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      // todo: 에러 핸들링
    },
  });
};
