import { useMutation } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

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

export const usePutChangePassword = () => {
  return useMutation({
    mutationFn: putChangePassword,
  });
};
