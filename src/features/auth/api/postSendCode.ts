import { useMutation } from "@tanstack/react-query";
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

export const usePostSendCode = () => {
  const handleOpenSnackbar = useSnackBar();

  return useMutation<unknown, HttpError, PostSendCodeRequest>({
    mutationKey: ["sendVerificationCode"],
    mutationFn: postSendCode,
    gcTime: 0,
    onSuccess: () => {
      handleOpenSnackbar("메일로 인증코드가 전송되었습니다");
    },
  });
};
