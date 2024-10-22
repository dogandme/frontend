import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { Snackbar } from "@/shared/ui/snackbar";
import { SETTING_END_POINT } from "../constants";
import { usePasswordSetFormStore } from "../store";

interface PutSetPasswordRequest {
  newPw: string;
  newPwChk: string;
}

interface PutSetPasswordResponse {
  code: number;
  message: string;
}

const putSetPassword = async (setPasswordData: PutSetPasswordRequest) => {
  const response = await fetch(SETTING_END_POINT.SET_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
    },
    body: JSON.stringify(setPasswordData),
  });

  const data: PutSetPasswordResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutSetPassword = () => {
  const resetPasswordSetForm = usePasswordSetFormStore((state) => state.reset);
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>비밀번호가 설정 되었습니다.</Snackbar>
    ));

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putSetPassword,
    mutationKey: ["putSetPassword"],
    onSuccess: () => {
      /* isPasswordSet 값의 mutation 이 일어났기 때문에 새로운 데이터를 패치 해옵니다. */
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      resetPasswordSetForm();
      handleOpenSnackbar();
    },
    onError: (error) => {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
