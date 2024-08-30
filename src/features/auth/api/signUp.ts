import { useMutation } from "@tanstack/react-query";
import { SIGN_UP_END_POINT } from "../constants";

interface SignUpByEmailResponse {
  code: number;
  message: string;
  content: {
    authorization: string;
    role: string;
    userId: number;
  };
}

interface SignUpByEmailRequestData {
  email: string;
  password: string;
}

const postSignUpByEmail = async ({
  email,
  password,
}: SignUpByEmailRequestData) => {
  const response = await fetch(SIGN_UP_END_POINT.EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data: SignUpByEmailResponse = await response.json();

  // todo: 예외처리 구체화하기
  // code = 409이면, 이미 가입된 계정
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePostSignUpByEmail = () => {
  return useMutation<SignUpByEmailResponse, Error, SignUpByEmailRequestData>({
    mutationFn: postSignUpByEmail,
  });
};
