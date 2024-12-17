import { create } from "zustand";
import { SNACKBAR_ID } from "../constants";
import { OverlayStore, useOverlayStore } from "../store/overlay";
import type { SnackBarProps } from "../ui/snackbar";

interface SnackbarStore extends OverlayStore {
  snackbarProps: SnackBarProps | null;
  setSnackbarProps: (snackbarProps: SnackBarProps | null) => void;
  handleOpenSnackbar: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => void;
}

export const useSnackBarStore = create<SnackbarStore>((set, get) => ({
  ...useOverlayStore.getState(),

  snackbarProps: null,

  setSnackbarProps: (snackbarProps) => set({ snackbarProps }),
  handleOpenSnackbar: (
    children: SnackBarProps["children"],
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => {
    const removeOverlay = get().removeOverlay;
    const setSnackbarProps = get().setSnackbarProps;
    removeOverlay(SNACKBAR_ID);
    setSnackbarProps({
      ...snackbarOptions,
      children,
    });
  },
}));
