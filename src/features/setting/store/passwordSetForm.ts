import { create } from "zustand";
import { validatePassword } from "@/features/auth/lib";

interface PasswordSetFormState {
  newPassword: string;
  confirmPassword: string;
  isValidNewPassword: boolean;
  isValidConfirmPassword: boolean;
  isFilledNewPassword: boolean;
  isFilledConfirmPassword: boolean;

  /* 유효성 검증 시 사용하기 위한 boolean */
  isAllValueValid: boolean;
  isAllValueFilled: boolean;
  isSameNewPasswordAndConfirmPassword: boolean;
}

interface PasswordChangeFormActions {
  setNewPassword: (newPassword: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;

  reset: () => void;
}

export const initialPasswordSetFormState: PasswordSetFormState = {
  newPassword: "",
  confirmPassword: "",

  isValidNewPassword: false,
  isValidConfirmPassword: false,

  isFilledNewPassword: false,
  isFilledConfirmPassword: false,

  isAllValueValid: false,
  isAllValueFilled: false,
  isSameNewPasswordAndConfirmPassword: true,
};

export const usePasswordSetFormStore = create<
  PasswordSetFormState & PasswordChangeFormActions
>((set, get) => ({
  ...initialPasswordSetFormState,

  setNewPassword: (newPassword: string) => {
    const { confirmPassword, isValidConfirmPassword } = get();
    const isValidNewPassword = validatePassword(newPassword);
    set({
      newPassword,
      isFilledNewPassword: !!newPassword,
      isValidNewPassword,
      isAllValueFilled: !!newPassword && !!confirmPassword,
      isAllValueValid: isValidNewPassword && isValidConfirmPassword,
      isSameNewPasswordAndConfirmPassword: confirmPassword === newPassword,
    });
  },
  setConfirmPassword: (confirmPassword: string) => {
    const { newPassword, isValidNewPassword } = get();
    const isValidConfirmPassword = validatePassword(confirmPassword);
    set({
      confirmPassword,
      isFilledConfirmPassword: !!confirmPassword,
      isValidConfirmPassword,
      isAllValueFilled: !!newPassword && !!confirmPassword,
      isAllValueValid: isValidNewPassword && isValidConfirmPassword,
      isSameNewPasswordAndConfirmPassword: newPassword === confirmPassword,
    });
  },
  reset: () => set({ ...initialPasswordSetFormState }),
}));
