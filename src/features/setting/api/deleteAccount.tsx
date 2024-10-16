import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

interface DeleteAccountRequest {
  password: string;
}

interface DeleteAccountResponse {
  code: number;
  message: string;
}

const deleteAccount = async ({ password }: DeleteAccountRequest) => {
  const response = await fetch(SETTING_END_POINT.DELETE_ACCOUNT, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
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
  return useMutation({
    mutationFn: deleteAccount,
    mutationKey: ["deleteAccount"],
    onSuccess: () => {
      window.location.href = ROUTER_PATH.MAIN;
    },
    onError: (error) => {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
