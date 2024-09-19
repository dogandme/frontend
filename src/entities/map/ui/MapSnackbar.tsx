import { Snackbar, SnackBarProps } from "@/shared/ui/snackbar";

export const MapSnackbar = ({
  children,
  ...props
}: Omit<SnackBarProps, "positionClassName">) => (
  <Snackbar
    {...props}
    positionClassName="absolute top-16 left-1/2 transform -translate-x-1/2 translate-y-1/2"
  >
    {children}
  </Snackbar>
);
