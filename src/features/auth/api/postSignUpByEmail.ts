import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

interface PostSignUpByEmailResponseData {
  authorization: string;
  role: string;
  userId: number;
}

interface PostSignUpByEmailRequestData {
  email: string;
  password: string;
}

const postSignUpByEmail = async ({
  email,
  password,
}: PostSignUpByEmailRequestData) => {
  return apiClient.post<PostSignUpByEmailResponseData>(
    SIGN_UP_END_POINT.EMAIL,
    {
      body: { email, password },
    },
  );
};

export const usePostSignUpByEmail = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  return useMutation<
    PostSignUpByEmailResponseData,
    Error,
    PostSignUpByEmailRequestData
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
