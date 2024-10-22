import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { AuthStore, useAuthStore } from "@/shared/store/auth";
import { CHANGE_USER_INFO_END_POINT } from "../constants";

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
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<unknown, Error, ChangeNicknameRequest>({
    mutationFn: putChangeNickname,
    onSuccess: (_, variables) => {
      setNickname(variables.nickname);
    },
  });
};
