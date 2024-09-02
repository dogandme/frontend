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

// TODO 리액트 쿼리를 활용하여 최적화 하기
export const usePostLoginForm = () => {
  const mutate = useMutation<LoginResponse, Error, EmailLoginFormData>({
    mutationFn: async (formData) => {
      const response = await fetch(LOGIN_END_POINT.EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error("문제가 발생했습니다. 잠시 후 다시 이용해주세요");
      }
      if (data.code === 401) {
        throw new Error("아이디 또는 비밀번호를 다시 확인해 주세요");
      }

      return data;
    },
  });

  return mutate;
};
