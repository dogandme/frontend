import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackBar } from "@/shared/lib";
import { AuthStore } from "@/shared/store";
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

const putSetPassword = async ({
  token,
  ...formObj
}: PutSetPasswordRequest & { token: NonNullable<AuthStore["token"]> }) => {
  const response = await fetch(SETTING_END_POINT.SET_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(formObj),
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
  onSuccessCallback?: () => void;
}) => {
  const resetPasswordSetForm = usePasswordSetFormStore((state) => state.reset);
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>비밀번호가 설정 되었습니다.</Snackbar>
    ));

  const queryClient = useQueryClient();

  const { mutate: pureMutate, ...rest } = useMutation({
    mutationFn: putSetPassword,
    mutationKey: ["putSetPassword"],
  });

  // TODO useMutation 에 심어진 onError 가 작동하지 않는 이유를 찾고 수정 하기
  const mutate = (args: Parameters<typeof putSetPassword>[0]) =>
    pureMutate(args, {
      onSuccess: () => {
        /* isPasswordSet 값의 mutation 이 일어났기 때문에 새로운 데이터를 패치 해옵니다. */
        queryClient.refetchQueries({ queryKey: ["myInfo"] });
        resetPasswordSetForm();
        handleOpenSnackbar();
        onSuccessCallback?.();
      },
      onError: (error) => {
        // TODO 에러바운더리 로직 나오면 변경 하기
        console.error(error);
      },
    });

  return { mutate, ...rest };
};
