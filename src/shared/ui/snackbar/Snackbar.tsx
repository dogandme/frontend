import { useOverlayStore } from "@/shared/store/overlay";
import { CloseIcon } from "../icon";

export const SNACKBAR_ID = 999999999;
export interface SnackBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  autoHideDuration?: number | null;
  className?: string;
}

/**
 * InfoSnackBar 컴포넌트는 사용자에게 정보를 제공하는 메시지를 표시합니다.
 * @param children - 스낵바에 표시할 메시지
 * @param className - 스낵바의 위치를 지정하는 클래스명
 */
export const Snackbar = ({
  children,
  className = "absolute top-4 left-1/2 transform -translate-x-1/2",
  ...props
}: SnackBarProps) => {
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const baseClassName =
    "shadow-custom-2 inline-flex min-w-[328px] max-w-96 items-center justify-between rounded-2xl bg-grey-0 py-1 pl-4 pr-3";

  return (
    <div className={`${baseClassName} ${className}`} {...props}>
      <div className="body-2 text-grey-700 flex flex-col">{children}</div>
      <button
        className="h-10"
        onClick={() => removeOverlay(SNACKBAR_ID)}
        aria-label="스낵바 닫기"
      >
        <CloseIcon />
      </button>
    </div>
  );
};
