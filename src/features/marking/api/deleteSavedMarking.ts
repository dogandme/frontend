import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_REQUEST_URL } from "../constants";

interface DeleteSavedMarkingRequestData {
  markingId: number;
}

const deleteSavedMarking = async ({
  markingId,
}: DeleteSavedMarkingRequestData) => {
  return apiClient.delete(MARKING_REQUEST_URL.SAVE(markingId), {
    withToken: true,
  });
};

export const useDeleteSavedMarking = () => {
  return useMutation<unknown, Error, DeleteSavedMarkingRequestData>({
    mutationFn: deleteSavedMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
