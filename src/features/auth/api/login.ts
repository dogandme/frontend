import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { useRouteHistoryStore } from "@/shared/store/history";
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
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setNickname = useAuthStore((state) => state.setNickname);

  const mutate = useMutation<LoginResponse, Error, EmailLoginFormData>({
    mutationFn: postLogin,
    onSuccess: ({ content }) => {
      const { authorization, role, nickname } = content;
      setToken(authorization);
      setRole(role);
      setNickname(nickname);

      if (role === "ROLE_NONE") {
        navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
        return;
      }

      const { lastNoneAuthRoute } = useRouteHistoryStore.getState();
      navigate(lastNoneAuthRoute);
    },
    onError: (error) => {
      // TODO 에러 처리 로직 추가하기
      throw new Error(error.message);
    },
  });

  return mutate;
};
