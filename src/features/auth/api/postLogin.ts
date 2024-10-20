import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { useRouteHistoryStore } from "@/shared/store/history";
import { LOGIN_END_POINT } from "../constants";

interface EmailLoginResponseData {
  authorization: string;
  role: string;
  userId: number | null;
  nickname: string | null;
}

interface EmailLoginRequestData {
  email: string;
  password: string;
  persistLogin: boolean;
}

const postLogin = async (formData: EmailLoginRequestData) => {
  return apiClient.post<EmailLoginResponseData>(LOGIN_END_POINT.EMAIL, {
    body: formData,
  });
};

// TODO 리액트 쿼리를 활용하여 최적화 하기
export const usePostLogin = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<EmailLoginResponseData, Error, EmailLoginRequestData>({
    mutationFn: postLogin,
    onSuccess: (data) => {
      const { authorization, role, nickname } = data;

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
};
