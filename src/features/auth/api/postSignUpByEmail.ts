import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

interface PostSignUpByEmailResponse {
  authorization: string;
  role: string;
  userId: number;
}

interface PostSignUpByEmailRequest {
  email: string;
  password: string;
}

const postSignUpByEmail = async ({
  email,
  password,
}: PostSignUpByEmailRequest) => {
  return apiClient.post<PostSignUpByEmailResponse>(SIGN_UP_END_POINT.EMAIL, {
    body: { email, password },
  });
};

export const usePostSignUpByEmail = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  return useMutation<
    PostSignUpByEmailResponse,
    Error,
    PostSignUpByEmailRequest
  >({
    mutationFn: postSignUpByEmail,
    onSuccess: (data) => {
      const { authorization, role } = data;

      setToken(authorization);
      setRole(role);

      navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
    },
    onError: (error) => {
      // todo: snackbar 띄우기
      alert(error.message);
    },
  });
};
