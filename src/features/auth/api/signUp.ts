import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

interface UserInfoRegistrationRequest {
  token: string;
  nickname: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: 10 | 20 | 30 | 40 | 50 | 60;
  region: number[];
  marketingYn: boolean;
}

interface UserInfoRegistrationResponse {
  code: number;
  message: string;
  content: {
    role: string;
    nickname: string;
    authorization: string;
  };
}

const putUserInfoRegister = async ({
  token,
  ...userInfo
}: UserInfoRegistrationRequest) => {
  const response = await fetch(SIGN_UP_END_POINT.USER_INFO, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
    },
    body: JSON.stringify(userInfo),
  });

  const data: UserInfoRegistrationResponse = await response.json();

  // todo: 예외처리 구체화하기
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePutUserInfoRegistration = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const setNickname = useAuthStore((state) => state.setNickname);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  return useMutation<
    UserInfoRegistrationResponse,
    Error,
    UserInfoRegistrationRequest
  >({
    mutationFn: putUserInfoRegister,
    onSuccess: (data) => {
      const { role, nickname, authorization } = data.content;

      setRole(role);
      setNickname(nickname);
      setToken(authorization);

      onSuccess();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
