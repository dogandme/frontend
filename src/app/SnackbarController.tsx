import { useEffect } from "react";
import { SNACKBAR_ID } from "@/shared/constants";
import { useSnackBarStore } from "@/shared/store";
import { Snackbar } from "@/shared/ui/snackbar";

export const SnackbarController = () => {
  const addOverlay = useSnackBarStore((state) => state.addOverlay);
  const removeOverlay = useSnackBarStore((state) => state.removeOverlay);
  const snackbarProps = useSnackBarStore((state) => state.snackbarProps);

  removeOverlay(SNACKBAR_ID);

  useEffect(() => {
    if (snackbarProps === null) return;

    const { children, ...snackbarOptions } = snackbarProps;
    addOverlay({
      id: SNACKBAR_ID,
      component: <Snackbar {...snackbarOptions}>{children}</Snackbar>,
      options: {
        disableInteraction: false,
      },
    });
  }, [snackbarProps, addOverlay]);

  return null;
};
