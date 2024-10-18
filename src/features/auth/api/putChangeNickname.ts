import { useMutation } from "@tanstack/react-query";
import { AuthStore, useAuthStore } from "@/shared/store/auth";
import { CHANGE_USER_INFO_END_POINT } from "../constants";

export interface ChangeNicknameResponse {
  code: number;
  message: string;
}

export interface ChangeNicknameRequest {
  token: NonNullable<AuthStore["token"]>;
  nickname: NonNullable<AuthStore["nickname"]>;
}

const putChangeNickname = async ({
  token,
  nickname,
}: ChangeNicknameRequest): Promise<ChangeNicknameResponse> => {
  const response = await fetch(CHANGE_USER_INFO_END_POINT.NICKNAME, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const usePutChangeNickname = ({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) => {
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<ChangeNicknameResponse, Error, ChangeNicknameRequest>({
    mutationFn: putChangeNickname,
    onSuccess: (_, variables) => {
      setNickname(variables.nickname);
      onSuccessCallback();
    },
  });
};
