import { useEffect } from "react";
import { SNACKBAR_ID } from "@/shared/constants";
import { useSnackBarStore } from "@/shared/store";
import { Snackbar } from "@/shared/ui/snackbar";

export const SnackbarController = () => {
  const addOverlay = useSnackBarStore((state) => state.addOverlay);
  const snackbarProps = useSnackBarStore((state) => state.snackbarProps);

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
