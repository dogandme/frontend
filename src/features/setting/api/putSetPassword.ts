import { useMutation } from "@tanstack/react-query";
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

export const usePutSetPassword = () => {
  return useMutation({
    mutationFn: putSetPassword,
  });
};
