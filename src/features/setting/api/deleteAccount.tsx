import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { AuthStore, useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

interface DeleteAccountRequest {
  password: string;
  token: NonNullable<AuthStore["token"]>;
}

interface DeleteAccountResponse {
  code: number;
  message: string;
}

const deleteAccount = async ({ password, token }: DeleteAccountRequest) => {
  const response = await fetch(SETTING_END_POINT.DELETE_ACCOUNT, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ password }),
  });
  const data: DeleteAccountResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const useDeleteAccount = () => {
  const { mutate: pureMutate, ...rest } = useMutation({
    mutationFn: deleteAccount,
    mutationKey: ["deleteAccount"],
  });
  const navigate = useNavigate();
  const resetAuthStore = useAuthStore((state) => state.reset);

  const mutate = (args: Parameters<typeof deleteAccount>[0]) =>
    pureMutate(args, {
      onSuccess: () => {
        // TODO navigate가 되지 않는 이유 찾아서 고치기
        navigate(ROUTER_PATH.MAIN);
        resetAuthStore();
      },
      onError: (error) => {
        // TODO 에러바운더리 로직 나오면 변경 하기
        console.error(error);
      },
    });

  return { ...rest, mutate };
};
