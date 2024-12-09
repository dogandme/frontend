import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { type Role, useAuthStore } from "@/shared/store";
import { useRouteHistoryStore } from "@/shared/store/history";
import { LOGIN_END_POINT } from "../constants";
import type { SignUpResponse } from "./type";

interface EmailLoginResponse extends SignUpResponse<NonNullable<Role>> {}

interface EmailLoginRequest {
  email: string;
  password: string;
  persistLogin: boolean;
}

const postLogin = async (formData: EmailLoginRequest) => {
  return apiClient.post<EmailLoginResponse>(LOGIN_END_POINT.EMAIL, {
    body: formData,
  });
};

export const usePostLogin = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation<EmailLoginResponse, Error, EmailLoginRequest>({
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
      console.error(error);
    },
  });
};
