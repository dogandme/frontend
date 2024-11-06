import { create } from "zustand";
import { validateEmail, validatePassword } from "../lib";

interface SignUpByEmailFormState {
  email: string;
  isEmailEmpty: boolean;
  isValidEmail: boolean;
  isEmailModified: boolean;

  verificationCode: string;

  timeLeft: number;
  isTimeLeftLessThanOneMinute: boolean;

  password: string;
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
    resetSignUpByEmailFormStore: () => void;

    // validation
    setIsEmailModified: (isEmailModified: boolean) => void;
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

  isEmailModified: false,
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
    setTimeLeft: (timeLeft) =>
      set({ timeLeft, isTimeLeftLessThanOneMinute: timeLeft <= 1000 * 60 }),
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
    resetSignUpByEmailFormStore: () => set({ ...initSignUpByEmailFormStore }),

    setIsEmailModified: (isEmailModified) => set({ isEmailModified }),
  },
}));
