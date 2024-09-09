import { useEffect } from "react";
import { CloseIcon } from "../icon";

interface InfoSnackBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClose: () => Promise<void>;
  autoHideDuration?: number | null;
  positionClassName?: string;
}

/**
 * InfoSnackBar 컴포넌트는 사용자에게 정보를 제공하는 메시지를 표시합니다.
 * @param children - 스낵바에 표시할 메시지
 * @param onClose - 스낵바를 닫는 함수
 * @param autoHideDuration - 스낵바가 자동으로 사라지는 시간 (ms), 기본적으로 InfoSnackbar는 1초 후 사라집니다. 만약 사라지기를 원치 않는 경우엔 null 을 전달해 주세요
 * @param positionClassName - 스낵바의 위치를 지정하는 클래스명
 */
export const Snackbar = ({
  children,
  onClose,
  autoHideDuration = 1000,
  positionClassName = "absolute top-4 left-1/2 transform -translate-x-1/2",
  ...props
}: InfoSnackBarProps) => {
  useEffect(() => {
    if (autoHideDuration === null) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timerId);
  }, [autoHideDuration, onClose]);

  const baseClassName =
    "shadow-info-snackbar inline-flex min-w-[328px] max-w-96 items-center justify-between rounded-2xl bg-grey-0 py-1 pl-4 pr-3";

  return (
    <div className={`${baseClassName} ${positionClassName}`} {...props}>
      <div className="body-2 text-grey-700">{children}</div>
      <button className="h-10" onClick={onClose} aria-label="스낵바 닫기">
        <CloseIcon />
      </button>
    </div>
  );
};
