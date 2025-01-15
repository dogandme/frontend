import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
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
  const reset = useAuthStore((state) => state.reset);
  const navigate = useNavigate();

  return useMutation<unknown, Error, DeleteAccountRequest>({
    mutationFn: deleteAccount,
    mutationKey: ["deleteAccount"],
    onSuccess: () => {
      reset();
      navigate(ROUTER_PATH.MAIN);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
