import {
  type MutationState,
  useMutation,
  useMutationState,
} from "@tanstack/react-query";
import { apiClient, HttpError, useSnackBar } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostSendCodeRequest {
  email: string;
}

const postSendCode = async ({ email }: PostSendCodeRequest) => {
  return apiClient.post(SIGN_UP_END_POINT.VERIFICATION_CODE, {
    body: { email },
    snackbarOnError: ({ code }) => code !== 409,
  });
};

const mutationKey = ["sendVerificationCode"];

export const usePostSendCode = () => {
  const handleOpenSnackbar = useSnackBar();

  return useMutation<unknown, HttpError, PostSendCodeRequest>({
    mutationKey,
    mutationFn: postSendCode,
    gcTime: 0,
    onSuccess: () => {
      handleOpenSnackbar("메일로 인증코드가 전송되었습니다");
    },
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
