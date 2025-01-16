import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useSnackbar } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

interface PutChangePasswordRequest {
  password: string;
  newPw: string;
  newPwChk: string;
}

const putChangePassword = async (
  changePasswordData: PutChangePasswordRequest,
) => {
  return apiClient.put(SETTING_END_POINT.CHANGE_PASSWORD, {
    withToken: true,
    body: changePasswordData,
  });
};

export const usePutChangePassword = () => {
  const handleOpenSnackbar = useSnackbar("default");

  return useMutation<unknown, Error, PutChangePasswordRequest>({
    mutationFn: putChangePassword,
    mutationKey: ["putChangePassword"],
    onSuccess: () => {
      handleOpenSnackbar("비밀번호가 변경되었습니다.");
    },
  });
};
