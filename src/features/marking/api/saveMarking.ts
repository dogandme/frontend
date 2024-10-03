import { useMutation } from "@tanstack/react-query";
import { MARKING_REQUEST_URL } from "../constants";

interface SaveMarkingResponse {
  code: number;
  message: string;
}

export interface SaveMarkingRequest {
  markingId: number;
  token: string;
}

const postSavedMarking = async ({ token, markingId }: SaveMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.SAVE(markingId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const data: SaveMarkingResponse = await response.json();

  return data;
};

export const usePostSavedMarking = () => {
  return useMutation<SaveMarkingResponse, Error, SaveMarkingRequest>({
    mutationFn: postSavedMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};

const deleteSavedMarking = async ({ token, markingId }: SaveMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.LIKE(markingId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const data: SaveMarkingResponse = await response.json();

  return data;
};

export const useDeleteSavedMarking = () => {
  return useMutation<SaveMarkingResponse, Error, SaveMarkingRequest>({
    mutationFn: deleteSavedMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
