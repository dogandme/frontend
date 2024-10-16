import { create } from "zustand";
import { validatePassword } from "@/features/auth/lib";

interface PasswordCheckFormState {
  password: string;
  isValidPassword: boolean;
  isEmptyPassword: boolean;
}

interface PasswordCheckFormAction {
  setPassword: (password: string) => void;
  reset: () => void;
}

export const initialPasswordCheckFormState: PasswordCheckFormState = {
  password: "",
  isValidPassword: false,
  isEmptyPassword: true,
};

export const usePasswordCheckFormStore = create<
  PasswordCheckFormState & PasswordCheckFormAction
>((set) => ({
  ...initialPasswordCheckFormState,

  setPassword: (password: string) =>
    set({
      password,
      isValidPassword: validatePassword(password),
      isEmptyPassword: password.length === 0,
    }),
  reset: () => set({ ...initialPasswordCheckFormState }),
}));
