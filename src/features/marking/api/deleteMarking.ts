import { useMutation } from "@tanstack/react-query";
import { MARKING_REQUEST_URL } from "../constants";

interface DeleteMarkingResponse {
  code: number;
  message: string;
}

type DeleteMarkingRequest = {
  markingId: number;
  token: string;
};

const deleteMarking = async ({ token, markingId }: DeleteMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.DELETE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ markingId }),
  });

  const data: DeleteMarkingResponse = await response.json();

  return data;
};

export const useDeleteMarking = () => {
  return useMutation<DeleteMarkingResponse, Error, DeleteMarkingRequest>({
    mutationFn: deleteMarking,
    onSuccess: () => {
      // todo 기존에 캐시된 내 마킹 데이터 삭제하기
    },
  });
};
