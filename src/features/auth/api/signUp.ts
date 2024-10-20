import { useNavigate } from "react-router-dom";
import {
  MutationState,
  useMutation,
  useMutationState,
} from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { AuthStore, useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

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
  token: NonNullable<AuthStore["token"]>;
}

export interface DuplicateNicknameResponse {
  code: number;
  message: string;
}

const postDuplicateNickname = async ({
  nickname,
  token,
}: DuplicateNicknameRequestData) => {
  const response = await fetch(SIGN_UP_END_POINT.DUPLICATE_NICKNAME, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
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

export const usePostDuplicateNicknameState = () => {
  // mutate 상태 결과들을 보고 중복된 닉네임인지 판단
  const mutationState = useMutationState<
    MutationState<
      DuplicateNicknameResponse,
      Error,
      DuplicateNicknameRequestData
    >
  >({
    filters: {
      mutationKey: ["checkDuplicateNickname"],
    },
  });

  const lastMutationState = mutationState[mutationState.length - 1];

  // todo 409 코드일 경우, 중복된 닉네임 처리
  const isDuplicateNickname = lastMutationState?.status === "error";
  const isPending = lastMutationState?.status === "pending";

  return { isDuplicateNickname, isPending };
};

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
