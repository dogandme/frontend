import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_REQUEST_URL } from "../constants";

export interface PostSaveMarkingRequestData {
  markingId: number;
}

const postSaveMarking = async ({ markingId }: PostSaveMarkingRequestData) => {
  return apiClient.post(MARKING_REQUEST_URL.SAVE(markingId), {
    withToken: true,
  });
};

export const usePostSaveMarking = () => {
  return useMutation<unknown, Error, PostSaveMarkingRequestData>({
    mutationFn: postSaveMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
