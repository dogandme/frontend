import { create } from "zustand";

interface PasswordCheckFormState {
  password: string;
  isValidPassword: boolean;
  isEmptyPassword: boolean;
}

interface PasswordCheckFormAction {
  setPassword: (password: string) => void;
  setIsValidPassword: (isValidPassword: boolean) => void;
  setIsEmptyPassword: (isEmptyPassword: boolean) => void;
  reset: () => void;
}

export const initialPasswordCheckFormState: PasswordCheckFormState = {
  password: "",
  isValidPassword: false,
  isEmptyPassword: true,
};

export const useAccountCancellationFormStore = create<
  PasswordCheckFormState & PasswordCheckFormAction
>((set) => ({
  ...initialPasswordCheckFormState,

  setPassword: (password: string) => set({ password }),
  setIsValidPassword: (isValidPassword: boolean) => set({ isValidPassword }),
  setIsEmptyPassword: (isEmptyPassword: boolean) => set({ isEmptyPassword }),
  reset: () => set({ ...initialPasswordCheckFormState }),
}));
