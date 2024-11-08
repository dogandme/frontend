import {
  type MutationState,
  useMutation,
  useMutationState,
} from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostSendCodeRequest {
  email: string;
}

const postSendCode = async ({ email }: PostSendCodeRequest) => {
  return apiClient.post(SIGN_UP_END_POINT.VERIFICATION_CODE, {
    body: { email },
  });
};

const mutationKey = ["sendVerificationCode"];

export const usePostSendCode = () => {
  return useMutation<unknown, HttpError, PostSendCodeRequest>({
    mutationKey,
    mutationFn: postSendCode,
    gcTime: 0,
  });
};

export const usePostSendCodeState = () => {
  const mutationState = useMutationState<
    MutationState<unknown, HttpError, PostSendCodeRequest>
  >({
    filters: {
      mutationKey,
      exact: true,
    },
  });

  const lastMutationState = mutationState[mutationState.length - 1];

  return lastMutationState;
};
