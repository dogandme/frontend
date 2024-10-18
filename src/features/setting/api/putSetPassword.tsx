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

const putSetPassword = async (setPasswordForm: PutSetPasswordRequest) => {
  const response = await fetch(SETTING_END_POINT.SET_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
    },
    body: JSON.stringify(setPasswordForm),
  });

  const data: PutSetPasswordResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutSetPassword = ({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) => {
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
      /**
       * onSuccessCallback 실행 후 시행 되는 beforeClose 는 mutationCache 를 통해 해당 뮤테이션의 상태를 확인하고
       * pending 상태이면 pending 상태를 기다리고, success 상태이면 닫히도록 하는 로직이 있습니다.
       * 하지만 mutationCache 는 onSuccess 시점에는 success 상태가 아니기 때문에 beforeClose 가 실행되지 않습니다.
       * 따라서 setTimeout 을 통해 onSuccessCallback 이후에 실행되도록 합니다.
       */
      setTimeout(onSuccessCallback, 0);
    },
    onError: (error) => {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
