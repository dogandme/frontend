import { useContext, createContext } from "react";
import { create, useStore } from "zustand";
import { validatePassword } from "@/features/auth/lib";

interface PasswordCheckFormState {
  password: string;
  isValidPassword: boolean;
  isEmptyPassword: boolean;
}

interface PasswordCheckFormAction {
  setPassword: (password: string) => void;
}

export const initialPasswordCheckFormState: PasswordCheckFormState = {
  password: "",
  isValidPassword: false,
  isEmptyPassword: true,
};

export const createPasswordCheckFormStore = () =>
  create<PasswordCheckFormState & PasswordCheckFormAction>((set) => ({
    ...initialPasswordCheckFormState,

    setPassword: (password: string) =>
      set({
        password,
        isValidPassword: validatePassword(password),
        isEmptyPassword: password.length === 0,
      }),
  }));

type PasswordCheckFormStore = ReturnType<typeof createPasswordCheckFormStore>;

export const PasswordCheckFormContext =
  createContext<PasswordCheckFormStore | null>(null);

export const usePasswordCheckFormContext = () => {
  const store = useContext(PasswordCheckFormContext);
  if (!store) {
    throw new Error(
      "usePasswordCheckFormContext 은 PasswordCheckFormProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return store;
};

export const usePasswordCheckFormStore = <T>(
  selector: (state: PasswordCheckFormState & PasswordCheckFormAction) => T,
): T => {
  const store = usePasswordCheckFormContext();
  return useStore(store, selector);
};
