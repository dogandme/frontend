import { useMutation } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
import { MARKING_REQUEST_URL } from "../constants";

interface LikeMarkingResponse {
  code: number;
  message: string;
}

export interface LikeMarkingRequest {
  markingId: number;
  token: NonNullable<AuthStore["token"]>;
}

const postLikeMarking = async ({ token, markingId }: LikeMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.LIKE(markingId), {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  const data: LikeMarkingResponse = await response.json();

  return data;
};

export const usePostLikeMarking = () => {
  return useMutation<LikeMarkingResponse, Error, LikeMarkingRequest>({
    mutationFn: postLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};

const deleteLikeMarking = async ({ token, markingId }: LikeMarkingRequest) => {
  const response = await fetch(MARKING_REQUEST_URL.LIKE(markingId), {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  const data: LikeMarkingResponse = await response.json();

  return data;
};

export const useDeleteLikeMarking = () => {
  return useMutation<LikeMarkingResponse, Error, LikeMarkingRequest>({
    mutationFn: deleteLikeMarking,
    onSuccess: () => {
      // todo 캐시된 데이터 수정
    },
  });
};
