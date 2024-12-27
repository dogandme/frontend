import { useState, useRef, useEffect } from "react";
import { SNACKBAR_ID } from "@/shared/constants";
import { useOverlayStore } from "@/shared/store";
import { CloseIcon } from "../icon";

export interface SnackBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  type?: "default" | "map";
  autoHideDuration?: number;
  className?: string;
}

/**
 * InfoSnackBar 컴포넌트는 사용자에게 정보를 제공하는 메시지를 표시합니다.
 * @param children - 스낵바에 표시할 메시지
 * @param className - 스낵바의 위치를 지정하는 클래스명
 */
export const Snackbar = ({
  children,
  autoHideDuration = 2000,
  type = "default",
  className = "",
  ...props
}: SnackBarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // 스낵바가 닫히는 애니메이션을 위한 타이머를 위한 ref
  const closeAnimationTimeId = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 스낵바가 닫히는 타이머를 위한 ref
  const closeTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const removeOverlay = useOverlayStore((state) => state.removeOverlay);
  const ANIMATION_DURATION = 500;

  useEffect(() => {
    closeAnimationTimeId.current = setTimeout(() => {
      setIsOpen(false);
    }, autoHideDuration - ANIMATION_DURATION);

    closeTimerId.current = setTimeout(() => {
      removeOverlay(SNACKBAR_ID);
    }, autoHideDuration);

    return () => {
      if (closeAnimationTimeId.current) {
        clearTimeout(closeAnimationTimeId.current);
      }
      if (closeTimerId.current) {
        clearTimeout(closeTimerId.current);
      }
    };
  }, []);

  return (
    <div
      className={`${isOpen ? `snackbar-open-${type}` : `snackbar-close-${type}`} 
      fixed left-1/2 top-0 shadow-custom-2 inline-flex min-w-[328px] max-w-96 items-center justify-between rounded-2xl bg-grey-0 py-1 pl-4 pr-3
      ${className}`}
      {...props}
    >
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
