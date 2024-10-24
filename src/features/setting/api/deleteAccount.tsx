import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

interface DeleteAccountRequest {
  password: string;
}

const deleteAccount = async (deleteAccountData: DeleteAccountRequest) => {
  return apiClient.delete(SETTING_END_POINT.DELETE_ACCOUNT, {
    withToken: true,
    body: deleteAccountData,
  });
};

export const useDeleteAccount = () => {
  return useMutation<unknown, Error, DeleteAccountRequest>({
    mutationFn: deleteAccount,
    mutationKey: ["deleteAccount"],
    onSuccess: () => {
      // 메모리 초기화를 위해 window 객체를 이용한 라우
      window.location.href = ROUTER_PATH.MAIN;
    },
    onError: (error) => {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
