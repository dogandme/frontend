import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient, useSnackBar } from "@/shared/lib";
import { Snackbar } from "@/shared/ui/snackbar";
import { SETTING_END_POINT } from "../constants";
import { usePasswordSetFormStore } from "../store";

interface PutSetPasswordRequest {
  newPw: string;
  newPwChk: string;
}

const putSetPassword = async (setPasswordData: PutSetPasswordRequest) => {
  return apiClient.put(SETTING_END_POINT.SET_PASSWORD, {
    withToken: true,
    body: setPasswordData,
  });
};

export const usePutSetPassword = () => {
  const resetPasswordSetForm = usePasswordSetFormStore((state) => state.reset);
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>비밀번호가 설정 되었습니다.</Snackbar>
    ));

  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PutSetPasswordRequest>({
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
