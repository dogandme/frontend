import { useMutation } from "@tanstack/react-query";
import { useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";
import { usePasswordChangeFormStore } from "../store";

interface PutChangePasswordRequest {
  password: string;
  newPw: string;
  newPwChk: string;
}

interface PutChangePasswordResponse {
  code: number;
  message: string;
}

const putChangePassword = async (
  changePasswordData: PutChangePasswordRequest,
) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
    },
    body: JSON.stringify(changePasswordData),
  });

  const data: PutChangePasswordResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutChangePassword = () => {
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );
  const handleOpenSnackbar = useSnackBar();

  return useMutation({
    mutationFn: putChangePassword,
    mutationKey: ["putChangePassword"],
    onSuccess: () => {
      resetPasswordChangeForm();
      handleOpenSnackbar("비밀번호가 변경되었습니다.");
    },
    onError: (error) => {
      // TODO 에러  바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
