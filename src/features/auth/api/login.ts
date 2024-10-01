import { useMutation } from "@tanstack/react-query";
import { LOGIN_END_POINT } from "../constants";

export interface LoginResponse {
  code: number;
  message: string;
  content: {
    authorization: string;
    role: string;
    userId: number | null;
    nickname: string | null;
  };
}

interface EmailLoginFormData {
  email: string;
  password: string;
  persistLogin: boolean;
}

const postLogin = async (
  formData: EmailLoginFormData,
): Promise<LoginResponse> => {
  const response = await fetch(LOGIN_END_POINT.EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

// TODO 리액트 쿼리를 활용하여 최적화 하기
export const usePostLoginForm = () => {
  const mutate = useMutation<LoginResponse, Error, EmailLoginFormData>({
    mutationFn: postLogin,
  });

  return mutate;
};
