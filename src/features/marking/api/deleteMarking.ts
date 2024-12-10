import { useMutation } from "@tanstack/react-query";
import type { Marking } from "@/entities/marking/types/server";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteMarkingRequest {
  markingId: Marking["markingId"];
}

export const useDeleteMarking = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: ({ markingId }: DeleteMarkingRequest) =>
      apiClient.delete(MARKING_END_POINT.DELETE, {
        withToken: true,
        body: { markingId },
      }),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      // todo: 에러 핸들링
    },
  });
};
