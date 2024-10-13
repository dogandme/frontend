import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

interface putSetPasswordRequest {
  newPw: string;
  newPwChk: string;
}

interface putSetPasswordResponse {
  code: number;
  message: string;
}

const putSetPassword = async ({
  token,
  ...formObj
}: putSetPasswordRequest & { token: NonNullable<AuthStore["token"]> }) => {
  const response = await fetch(SETTING_END_POINT.SET_PASSWORD, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(formObj),
  });

  const data: putSetPasswordResponse = await response.json();

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
  const queryClient = useQueryClient();

  const { mutate: pureMutate, ...rest } = useMutation({
    mutationFn: putSetPassword,
    mutationKey: ["putSetPassword"],
  });

  // TODO useMutation 에 심어진 onError 가 작동하지 않는 이유를 찾고 수정 하기
  const mutate = (args: Parameters<typeof putSetPassword>[0]) =>
    pureMutate(args, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["myInfo"] });
        onSuccessCallback();
      },
      onError: (error) => {
        // TODO 에러바운더리 로직 나오면 변경 하기
        console.error(error);
      },
    });

  return { mutate, ...rest };
};
