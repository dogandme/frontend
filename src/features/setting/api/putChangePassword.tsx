import { useMutation } from "@tanstack/react-query";
import { useSnackBar } from "@/shared/lib";
import { AuthStore } from "@/shared/store";
import { Snackbar } from "@/shared/ui/snackbar";
import { SETTING_END_POINT } from "../constants";
import { usePasswordChangeFormStore } from "../store";

interface putChangePasswordRequest {
  password: string;
  newPw: string;
  newPwChk: string;
}

interface putChangePasswordResponse {
  code: number;
  message: string;
}

const putChangePassword = async ({
  token,
  ...formOj
}: putChangePasswordRequest & { token: NonNullable<AuthStore["token"]> }) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(formOj),
  });

  const data: putChangePasswordResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
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

  const { mutate: pureMutate, ...rest } = useMutation({
    mutationFn: putChangePassword,
    mutationKey: ["putChangePassword"],
  });

  const mutate = (args: Parameters<typeof putChangePassword>[0]) =>
    pureMutate(args, {
      onSuccess: () => {
        resetPasswordChangeForm();
        handleOpenSnackbar();
        onSuccessCallback?.();
      },
      onError: (error) => {
        // TODO 에러  바운더리 로직 나오면 변경 하기
        console.error(error);
      },
    });

  return { mutate, ...rest };
};
