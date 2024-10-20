import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostSendCodeRequestData {
  email: string;
}

const postSendCode = async ({ email }: PostSendCodeRequestData) => {
  return apiClient.post(SIGN_UP_END_POINT.VERIFICATION_CODE, {
    withToken: true,
    body: { email },
  });
};

export const usePostSendCode = () => {
  return useMutation<unknown, Error, PostSendCodeRequestData>({
    mutationFn: postSendCode,
    mutationKey: ["sendVerificationCode"],
  });
};
