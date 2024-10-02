import { useMutation } from "@tanstack/react-query";
import { MARKING_REQUEST_URL } from "../constants";

interface LikeMarkingResponse {
  code: number;
  message: string;
}

export interface LikeMarkingRequest {
  markingId: number;
  token: string;
}

const likeMarking = async ({ token, markingId }: LikeMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.LIKE(markingId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const data: LikeMarkingResponse = await response.json();

  return data;
};

export const useLikeMarking = () => {
  return useMutation<LikeMarkingResponse, Error, LikeMarkingRequest>({
    mutationFn: likeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};

const unlikeMarking = async ({ token, markingId }: LikeMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.LIKE(markingId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const data: LikeMarkingResponse = await response.json();

  return data;
};

export const useUnlikeMarking = () => {
  return useMutation<LikeMarkingResponse, Error, LikeMarkingRequest>({
    mutationFn: unlikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
