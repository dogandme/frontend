import { useRef, useEffect } from "react";
import { SNACKBAR_ID } from "../constants";
import { useOverlayStore } from "../store/overlay";
import { Snackbar, SnackBarProps } from "../ui/snackbar";

/**
 * useSnackBar 훅은 스낵바를 열고 닫는 기능을 제공합니다.
 * 스낵바는 일정 시간 후 자동으로 닫힐 수 있습니다.
 *
 * @returns {Function} handleOpenSnackbar - 스낵바를 여는 함수.
 * @param {React.ReactNode} text - 스낵바에 표시할 텍스트.
 * @param {Object} [snackbarOptions] - 스낵바 옵션.
 * @param {number} [snackbarOptions.autoHideDuration=1000] - 스낵바가 자동으로 닫히기까지의 시간(ms).
 * @param {Omit<SnackBarProps, "children">} [snackbarOptions] - 스낵바 컴포넌트의 기타 속성.
 */
export const useSnackBar = () => {
  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SNACKBAR_POSITION_CLASS_NAME = {
    default: "absolute top-4 left-1/2 transform -translate-x-1/2",
    map: "absolute top-16 left-1/2 transform -translate-x-1/2 translate-y-1/2",
  };

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  const handleOpenSnackbar = (
    text: React.ReactNode,
    snackbarOptions?: {
      autoHideDuration?: number;
      type?: "default" | "map";
    } & Omit<SnackBarProps, "children">,
  ) => {
    // TODO authHideDuration 기간 정하기
    const {
      autoHideDuration = 1000,
      type = "default",
      className = "",
      ...snackbarProps
    } = snackbarOptions || {};
    // autoHideDuration 시간 후 스낵바를 닫습니다.
    // 이 때 타이머 발동 전 기존 스낵바가 다시 열리게 되면 clearTimeout을 호출하여 이전 타이머를 초기화 합니다.
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      removeOverlay(SNACKBAR_ID);
    }, autoHideDuration);

    // 열려있는 스낵바가 있다면 제거합니다.
    removeOverlay(SNACKBAR_ID);

    addOverlay({
      id: SNACKBAR_ID,
      component: (
        <Snackbar
          {...snackbarProps}
          className={`${SNACKBAR_POSITION_CLASS_NAME[type]} ${className}`}
        >
          {text}
        </Snackbar>
      ),
      options: {
        disableInteraction: false,
      },
    });
  };

  return handleOpenSnackbar;
};
