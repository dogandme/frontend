import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/features/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

interface VerificationCodeRequestData {
  email: string;
}

interface VerificationCodeResponse {
  code: number;
  message: string;
}

const postVerificationCode = async ({ email }: VerificationCodeRequestData) => {
  const response = await fetch(SIGN_UP_END_POINT.VERIFICATION_CODE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data: SignUpByEmailResponse = await response.json();

  // todo: 예외처리 구체화하기
  // code = 409이면, 이미 가입된 이메일 있음
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePostVerificationCode = () => {
  return useMutation<
    VerificationCodeResponse,
    Error,
    VerificationCodeRequestData
  >({
    mutationFn: postVerificationCode,
    mutationKey: ["sendVerificationCode"],
  });
};

export interface CheckVerificationCodeRequestData {
  email: string;
  authNum: string;
}

export interface CheckVerificationCodeResponse {
  code: number;
  message: string;
}

const postCheckVerificationCode = async ({
  email,
  authNum,
}: CheckVerificationCodeRequestData) => {
  const response = await fetch(SIGN_UP_END_POINT.CHECK_VERIFICATION_CODE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, authNum }),
  });

  const data: CheckVerificationCodeResponse = await response.json();

  // 401: 인증번호 불일치
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePostCheckVerificationCode = () => {
  return useMutation<
    CheckVerificationCodeResponse,
    Error,
    CheckVerificationCodeRequestData
  >({
    mutationFn: postCheckVerificationCode,
    mutationKey: ["checkVerificationCode"],
  });
};

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
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  return useMutation<SignUpByEmailResponse, Error, SignUpByEmailRequestData>({
    mutationFn: postSignUpByEmail,
    onSuccess: ({ content }) => {
      const { authorization, role } = content;

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

export interface DuplicateNicknameRequestData {
  nickname: string;
}

export interface DuplicateNicknameResponse {
  code: number;
  message: string;
}

const postDuplicateNickname = async ({
  nickname,
}: DuplicateNicknameRequestData) => {
  const response = await fetch(SIGN_UP_END_POINT.DUPLICATE_NICKNAME, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname }),
  });

  const data: DuplicateNicknameResponse = await response.json();

  // 409: 중복된 닉네임
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePostDuplicateNickname = () => {
  return useMutation<
    DuplicateNicknameResponse,
    Error,
    DuplicateNicknameRequestData
  >({
    mutationFn: postDuplicateNickname,
    mutationKey: ["checkDuplicateNickname"],
  });
};

interface UserInfoRegistrationRequest {
  token: string;
  nickname: string;
  gender: "FEMALE" | "MALE";
  age: 10 | 20 | 30 | 40 | 50;
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

  const queryClient = useQueryClient();

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

      queryClient.prefetchQuery({
        queryKey: ["profile", nickname],
        queryFn: () => getProfile(nickname),
      });

      onSuccess();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
