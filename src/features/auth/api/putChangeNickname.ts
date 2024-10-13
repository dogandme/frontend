import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store/auth";
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

export const usePutChangeNickname = () => {
  const queryClient = useQueryClient();

  return useMutation<ChangeNicknameResponse, Error, ChangeNicknameRequest>({
    mutationFn: putChangeNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myInfo"],
      });
    },
  });
};
