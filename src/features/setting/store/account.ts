import { create } from "zustand";

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
  isEmptyCurrentPassword: boolean;
  isEmptyNewPassword: boolean;
  isEmptyConfirmPassword: boolean;
}

interface PasswordChangeFormActions {
  setCurrentPassword: (currentPassword: string) => void;
  setNewPassword: (newPassword: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;

  setIsValidPassword: (isValidPassword: boolean) => void;
  setIsValidNewPassword: (isValidNewPassword: boolean) => void;
  setIsValidConfirmPassword: (isValidConfirmPassword: boolean) => void;

  setIsEmptyCurrentPassword: (isEmptyCurrentPassword: boolean) => void;
  setIsEmptyNewPassword: (isEmptyNewPassword: boolean) => void;
  setIsEmptyConfirmPassword: (isEmptyConfirmPassword: boolean) => void;
}

export const initialPasswordChangeFormState: PasswordChangeFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

  isValidPassword: false,
  isValidNewPassword: false,
  isValidConfirmPassword: false,

  isEmptyCurrentPassword: true,
  isEmptyNewPassword: true,
  isEmptyConfirmPassword: true,
};

export const usePasswordChangeFormStore = create<
  PasswordChangeFormState & PasswordChangeFormActions
>((set) => ({
  ...initialPasswordChangeFormState,

  setCurrentPassword: (currentPassword: string) => set({ currentPassword }),
  setNewPassword: (newPassword: string) => set({ newPassword }),
  setConfirmPassword: (confirmPassword: string) => set({ confirmPassword }),

  setIsValidPassword: (isValidPassword: boolean) => set({ isValidPassword }),
  setIsValidNewPassword: (isValidNewPassword: boolean) =>
    set({ isValidNewPassword }),
  setIsValidConfirmPassword: (isValidConfirmPassword: boolean) =>
    set({ isValidConfirmPassword }),

  // empty check
  setIsEmptyCurrentPassword: (isEmptyCurrentPassword: boolean) =>
    set({ isEmptyCurrentPassword }),
  setIsEmptyNewPassword: (isEmptyNewPassword: boolean) =>
    set({ isEmptyNewPassword }),
  setIsEmptyConfirmPassword: (isEmptyConfirmPassword: boolean) =>
    set({ isEmptyConfirmPassword }),
}));
