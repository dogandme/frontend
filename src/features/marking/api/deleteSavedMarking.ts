import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteSavedMarkingRequest {
  markingId: number;
}

const deleteSavedMarking = async ({ markingId }: DeleteSavedMarkingRequest) => {
  return apiClient.delete(MARKING_END_POINT.SAVE(markingId), {
    withToken: true,
  });
};

export const useDeleteSavedMarking = () => {
  return useMutation<unknown, Error, DeleteSavedMarkingRequest>({
    mutationFn: deleteSavedMarking,
  });
};
