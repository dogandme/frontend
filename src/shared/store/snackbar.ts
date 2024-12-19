import { create } from "zustand";
import { SNACKBAR_ID } from "../constants";
import { type OverlayStore, useOverlayStore } from "../store/overlay";
import type { SnackBarProps } from "../ui/snackbar";

interface SnackbarStore extends OverlayStore {
  snackbarProps: SnackBarProps | null;
  setSnackbarProps: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => void;
}

export const useSnackBarStore = create<SnackbarStore>((set, get) => ({
  ...useOverlayStore.getState(),

  snackbarProps: null,
  setSnackbarProps: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => {
    const removeOverlay = get().removeOverlay;
    removeOverlay(SNACKBAR_ID);
    set({
      snackbarProps: {
        ...snackbarOptions,
        children,
      },
    });
  },
}));
