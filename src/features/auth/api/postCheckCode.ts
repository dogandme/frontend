import {
  type MutationState,
  useMutation,
  useMutationState,
} from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostCheckCodeRequest {
  email: string;
  authNum: string;
}

const postCheckCode = async ({ email, authNum }: PostCheckCodeRequest) => {
  // postman에 token이 필요 없다고 명시되어 있음
  return apiClient.post(SIGN_UP_END_POINT.CHECK_VERIFICATION_CODE, {
    body: { email, authNum },
  });
};

const mutationKey = ["checkVerificationCode"];

export const usePostCheckCode = () => {
  return useMutation<unknown, HttpError, PostCheckCodeRequest>({
    mutationKey,
    mutationFn: postCheckCode,
    gcTime: 0,
  });
};

export const usePostCheckCodeState = () => {
  const mutationState = useMutationState<
    MutationState<unknown, HttpError, PostCheckCodeRequest>
  >({
    filters: {
      mutationKey,
      exact: true,
    },
  });

  const lastMutationState = mutationState[mutationState.length - 1];

  return lastMutationState;
};
