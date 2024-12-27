import { forwardRef } from "react";
import { CloseIcon } from "../icon";

export interface _SnackbarProps {
  children: React.ReactNode;
  type: "default" | "map";
  onClose: () => void;
}

export const _Snackbar = forwardRef(
  (
    { children, type, onClose }: _SnackbarProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        className={`${`snackbar-slideDown-${type}`} 
          fixed left-1/2 top-0 shadow-custom-2 inline-flex min-w-[328px] max-w-96 items-center justify-between rounded-2xl bg-grey-0 py-1 pl-4 pr-3`}
        ref={ref}
      >
        <div className="body-2 text-grey-700 flex flex-col">{children}</div>
        <button className="h-10" onClick={onClose} aria-label="스낵바 닫기">
          <CloseIcon />
        </button>
      </div>
    );
  },
);
