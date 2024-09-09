import { useMutation } from "@tanstack/react-query";
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
  });
};

interface CheckVerificationCodeRequestData {
  email: string;
  authNum: string;
}

interface CheckVerificationCodeResponse {
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
  return useMutation<SignUpByEmailResponse, Error, SignUpByEmailRequestData>({
    mutationFn: postSignUpByEmail,
  });
};

interface UserInfoRegistrationRequest {
  token: string;
  nickname: string;
  gender: "FEMALE" | "MALE";
  age: 10 | 20 | 30 | 40 | 50;
  region: string;
  marketingYn: boolean;
}

interface UserInfoRegistrationResponse {
  code: number;
  message: string;
  content: {
    role: string;
    nickname: string;
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

export const usePutUserInfoRegistration = () => {
  return useMutation<
    UserInfoRegistrationResponse,
    Error,
    UserInfoRegistrationRequest
  >({
    mutationFn: putUserInfoRegister,
  });
};
