import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { AuthStore, useAuthStore } from "@/shared/store/auth";
import { CHANGE_USER_INFO_END_POINT } from "../constants";

interface ChangeNicknameRequestData {
  nickname: NonNullable<AuthStore["nickname"]>;
}

const putChangeNickname = async ({ nickname }: ChangeNicknameRequestData) => {
  return apiClient.put(CHANGE_USER_INFO_END_POINT.NICKNAME, {
    withToken: true,
    body: { nickname },
  });
};

export const usePutChangeNickname = ({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) => {
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<unknown, Error, ChangeNicknameRequestData>({
    mutationFn: putChangeNickname,
    onSuccess: (_, variables) => {
      setNickname(variables.nickname);
      onSuccessCallback();
    },
  });
};
