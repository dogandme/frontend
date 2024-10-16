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
      queryClient.refetchQueries({ queryKey: ["myInfo"] });
      resetPasswordSetForm();
      handleOpenSnackbar();
      // TODO beforeClose 에서 해당 뮤테이션의 key 가 확률적으로 pending 상태이거나 success 이거나 하는 문제가 있어
      // 0초 뒤에 실행되도록 변경했습니다.
      // 이러한 문제는 비동기 함수의 실행 순서에 따라 발생하는 문제로 보이는데
      // 우선 테스트 이후 해당 문제를 해결하도록 하겠습니다.
      setTimeout(onSuccessCallback, 0);
    },
    onError: (error) => {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
