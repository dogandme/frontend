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

export const usePutChangePassword = ({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) => {
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
      /**
       * onSuccessCallback 실행 후 시행 되는 beforeClose 는 mutationCache 를 통해 해당 뮤테이션의 상태를 확인하고
       * pending 상태이면 pending 상태를 기다리고, success 상태이면 닫히도록 하는 로직이 있습니다.
       * 하지만 mutationCache 는 onSuccess 시점에는 success 상태가 아니기 때문에 beforeClose 가 실행되지 않습니다.
       * 따라서 setTimeout 을 통해 onSuccessCallback 이후에 실행되도록 합니다.
       */
      setTimeout(onSuccessCallback, 0);
    },
    onError: (error) => {
      // TODO 에러  바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
