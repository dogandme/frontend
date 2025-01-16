import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKey } from "@/entities/auth/api";
import { apiClient, type HttpError } from "@/shared/lib";
import { AuthStore, useAuthStore } from "@/shared/store/auth";
import { CHANGE_USER_INFO_END_POINT } from "../constants";
import { changeUserInfoQueryKey } from "./queryKey";

interface ChangeNicknameRequest {
  nickname: NonNullable<AuthStore["nickname"]>;
}

const putChangeNickname = async ({ nickname }: ChangeNicknameRequest) => {
  return apiClient.put(CHANGE_USER_INFO_END_POINT.NICKNAME, {
    withToken: true,
    body: { nickname },
  });
};

export const usePutChangeNickname = () => {
  const queryClient = useQueryClient();
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<unknown, HttpError, ChangeNicknameRequest>({
    mutationKey: changeUserInfoQueryKey.nickname(),
    mutationFn: putChangeNickname,
    onSuccess: (_, variables) => {
      setNickname(variables.nickname);

      queryClient.invalidateQueries({
        queryKey: authQueryKey.myInfo(),
      });
    },
  });
};
