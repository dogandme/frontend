import { useMutation } from "@tanstack/react-query";
import { apiClient, type HttpError } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";

export interface PostCheckDuplicateNicknameRequest {
  nickname: string;
}

const postCheckDuplicateNickname = async ({
  nickname,
}: PostCheckDuplicateNicknameRequest) => {
  return apiClient.post(SIGN_UP_END_POINT.DUPLICATE_NICKNAME, {
    withToken: true,
    body: { nickname },
    snackbarOnError: ({ code }) => code !== 409,
  });
};

export const usePostCheckDuplicateNickname = () => {
  return useMutation<unknown, HttpError, PostCheckDuplicateNicknameRequest>({
    mutationFn: postCheckDuplicateNickname,
    mutationKey: ["checkDuplicateNickname"],
  });
};
