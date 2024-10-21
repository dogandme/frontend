import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
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

export const usePostCheckCode = () => {
  return useMutation<unknown, Error, PostCheckCodeRequest>({
    mutationFn: postCheckCode,
    mutationKey: ["checkVerificationCode"],
  });
};
