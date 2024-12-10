import { create } from "zustand";
import type { PostSignUpByEmailRequest } from "../api";
import { validateEmail, validatePassword } from "../lib";

interface SignUpByEmailFormState extends PostSignUpByEmailRequest {
  isEmailEmpty: boolean;
  isValidEmail: boolean;

  verificationCode: string;

  timeLeft: number;
  isTimeLeftLessThanOneMinute: boolean;

  isPasswordEmpty: boolean;
  isValidPassword: boolean;

  confirmPassword: string;
  isConfirmPasswordEmpty: boolean;
  isValidConfirmPassword: boolean;
}

interface SignUpByEmailFormActions {
  actions: {
    setEmail: (email: string) => void;
    setVerificationCode: (verificationCode: string) => void;
    setTimeLeft: (timeLeft: number) => void;

    setPassword: (password: string) => void;
    setConfirmPassword: (passwordConfirm: string) => void;

    resetState: (keys?: (keyof SignUpByEmailFormState)[]) => void;
  };
}

const initSignUpByEmailFormStore: SignUpByEmailFormState = {
  email: "",
  isEmailEmpty: true,
  isValidEmail: false,

  verificationCode: "",

  timeLeft: 0,
  isTimeLeftLessThanOneMinute: true,

  password: "",
  isPasswordEmpty: true,
  isValidPassword: false,

  confirmPassword: "",
  isConfirmPasswordEmpty: true,
  isValidConfirmPassword: false,
};

export const useSignUpByEmailFormStore = create<
  SignUpByEmailFormState & SignUpByEmailFormActions
>((set, get) => ({
  ...initSignUpByEmailFormStore,

  actions: {
    setEmail: (email) =>
      set({
        email,
        isEmailEmpty: email === "",
        isValidEmail: validateEmail(email),
      }),
    setVerificationCode: (verificationCode) => set({ verificationCode }),
    setTimeLeft: (timeLeft) => {
      // 시간이 다 지나면 verificationCode 초기화
      if (timeLeft === 0) {
        set({ verificationCode: "" });
      }

      set({ timeLeft, isTimeLeftLessThanOneMinute: timeLeft <= 1000 * 60 });
    },
    setPassword: (password) => {
      const { confirmPassword } = get();

      set({
        password,
        isPasswordEmpty: password === "",
        isValidPassword: validatePassword(password),
        isValidConfirmPassword: password === confirmPassword,
      });
    },
    setConfirmPassword: (passwordConfirm) => {
      const { password } = get();

      set({
        confirmPassword: passwordConfirm,
        isConfirmPasswordEmpty: passwordConfirm === "",
        isValidConfirmPassword: password === passwordConfirm,
      });
    },
    resetState: (keys) => {
      // 전체 상태 초기화
      if (!keys) {
        set(initSignUpByEmailFormStore);
        return;
      }

      // 일부 상태 초기화
      keys.forEach((key) => {
        set({ [key]: initSignUpByEmailFormStore[key] });
      });
    },
  },
}));
