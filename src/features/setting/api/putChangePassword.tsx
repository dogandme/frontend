import { useMutation } from "@tanstack/react-query";
import { apiClient, useSnackBar } from "@/shared/lib";
import { Snackbar } from "@/shared/ui/snackbar";
import { SETTING_END_POINT } from "../constants";
import { usePasswordChangeFormStore } from "../store";

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
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>비밀번호가 변경되었습니다.</Snackbar>
    ));

  return useMutation<unknown, Error, PutChangePasswordRequest>({
    mutationFn: putChangePassword,
    mutationKey: ["putChangePassword"],
    onSuccess: () => {
      resetPasswordChangeForm();
      handleOpenSnackbar();
    },
    onError: (error) => {
      // TODO 에러  바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
