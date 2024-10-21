import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostSendCodeRequest {
  email: string;
}

const postSendCode = async ({ email }: PostSendCodeRequest) => {
  return apiClient.post(SIGN_UP_END_POINT.VERIFICATION_CODE, {
    body: { email },
  });
};

export const usePostSendCode = () => {
  return useMutation<unknown, Error, PostSendCodeRequest>({
    mutationFn: postSendCode,
    mutationKey: ["sendVerificationCode"],
  });
};
