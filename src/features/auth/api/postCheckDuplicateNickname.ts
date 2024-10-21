import {
  MutationState,
  useMutation,
  useMutationState,
} from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
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
  });
};

export const usePostCheckDuplicateNickname = () => {
  return useMutation<unknown, Error, PostCheckDuplicateNicknameRequest>({
    mutationFn: postCheckDuplicateNickname,
    mutationKey: ["checkDuplicateNickname"],
  });
};

export const usePostCheckDuplicateNicknameState = () => {
  // mutate 상태 결과들을 보고 중복된 닉네임인지 판단
  const mutationState = useMutationState<
    MutationState<unknown, Error, PostCheckDuplicateNicknameRequest>
  >({
    filters: {
      mutationKey: ["checkDuplicateNickname"],
    },
  });

  const lastMutationState = mutationState[mutationState.length - 1];

  // todo 409 코드일 경우, 중복된 닉네임 처리
  const isDuplicateNickname = lastMutationState?.status === "error";
  const isPending = lastMutationState?.status === "pending";

  return { isDuplicateNickname, isPending };
};
