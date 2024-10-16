import { create } from "zustand";
import { validatePassword } from "@/features/auth/lib";

interface PasswordChangeFormState {
  // password value
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  // validate password
  isValidPassword: boolean;
  isValidNewPassword: boolean;
  isValidConfirmPassword: boolean;
  // empty check
  isFilledCurrentPassword: boolean;
  isFilledNewPassword: boolean;
  isFilledConfirmPassword: boolean;

  /* 유효성 검증 시 사용하기 위한 boolean */
  isAllValueValid: boolean;
  isAllValueFilled: boolean;
  isSameNewPasswordAndConfirmPassword: boolean;
}

interface PasswordChangeFormActions {
  setCurrentPassword: (currentPassword: string) => void;
  setNewPassword: (newPassword: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;

  reset: () => void;
}

export const initialPasswordChangeFormState: PasswordChangeFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

  isValidPassword: false,
  isValidNewPassword: false,
  isValidConfirmPassword: false,

  isFilledCurrentPassword: false,
  isFilledNewPassword: false,
  isFilledConfirmPassword: false,

  isAllValueValid: false,
  isAllValueFilled: false,
  isSameNewPasswordAndConfirmPassword: true,
};

export const usePasswordChangeFormStore = create<
  PasswordChangeFormState & PasswordChangeFormActions
>((set, get) => ({
  ...initialPasswordChangeFormState,

  setCurrentPassword: (currentPassword: string) => {
    const {
      newPassword,
      confirmPassword,
      isValidNewPassword,
      isValidConfirmPassword,
    } = get();
    const isValidPassword = validatePassword(currentPassword);
    set({
      currentPassword,
      isFilledCurrentPassword: !!currentPassword,
      isValidPassword,
      isAllValueFilled: !!currentPassword && !!newPassword && !!confirmPassword,
      isAllValueValid:
        isValidPassword && isValidNewPassword && isValidConfirmPassword,
    });
  },
  setNewPassword: (newPassword: string) => {
    const {
      currentPassword,
      confirmPassword,
      isValidPassword,
      isValidConfirmPassword,
    } = get();
    const isValidNewPassword = validatePassword(newPassword);
    set({
      newPassword,
      isFilledNewPassword: !!newPassword,
      isValidNewPassword,
      isAllValueFilled: !!currentPassword && !!newPassword && !!confirmPassword,
      isAllValueValid:
        isValidPassword && isValidNewPassword && isValidConfirmPassword,
      isSameNewPasswordAndConfirmPassword: confirmPassword === newPassword,
    });
  },
  setConfirmPassword: (confirmPassword: string) => {
    const {
      currentPassword,
      newPassword,
      isValidPassword,
      isValidNewPassword,
    } = get();
    const isValidConfirmPassword = validatePassword(confirmPassword);
    set({
      confirmPassword,
      isFilledConfirmPassword: !!confirmPassword,
      isValidConfirmPassword,
      isAllValueFilled: !!currentPassword && !!newPassword && !!confirmPassword,
      isAllValueValid:
        isValidPassword && isValidNewPassword && isValidConfirmPassword,
      isSameNewPasswordAndConfirmPassword: newPassword === confirmPassword,
    });
  },
  reset: () => set({ ...initialPasswordChangeFormState }),
}));
