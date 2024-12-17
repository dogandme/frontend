import { create } from "zustand";
import { OverlayStore, useOverlayStore } from "../store/overlay";
import type { SnackBarProps } from "../ui/snackbar";

interface SnackbarStore extends OverlayStore {
  snackbarProps: SnackBarProps | null;
  setSnackbarProps: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => void;
}

export const useSnackBarStore = create<SnackbarStore>((set) => ({
  ...useOverlayStore.getState(),

  snackbarProps: null,
  setSnackbarProps: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => {
    set({
      snackbarProps: {
        ...snackbarOptions,
        children,
      },
    });
  },
}));
