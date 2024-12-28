import { useMutation } from "@tanstack/react-query";
import { apiClient, HttpError } from "@/shared/lib";
import { useSnackbar } from "@/shared/lib/snackbar";
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
  const handleSnackbarOpen = useSnackbar("default");

  return useMutation<unknown, HttpError, PostSendCodeRequest>({
    mutationKey: ["sendVerificationCode"],
    mutationFn: postSendCode,
    gcTime: 0,
    onSuccess: () => {
      handleSnackbarOpen("메일로 인증코드가 전송되었습니다");
    },
  });
};
