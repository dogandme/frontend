import { flushSync } from "react-dom";
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
 * @param {number} [snackbarOptions.autoHideDuratio sn=1000] - 스낵바가 자동으로 닫히기까지의 시간(ms).
 * @param {Omit<SnackBarProps, "children">} [snackbarOptions] - 스낵바 컴포넌트의 기타 속성.
 */
export const useSnackBar = () => {
  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const handleOpenSnackbar = (
    text: React.ReactNode,
    snackbarOptions?: Omit<SnackBarProps, "children">,
  ) => {
    // 열려있는 스낵바가 있다면 제거합니다.
    // ! handleOpenSnackbar 함수는 동기적으로 동작해야 하므로 flushSync를 사용합니다.
    flushSync(() => {
      removeOverlay(SNACKBAR_ID);
    });

    addOverlay({
      id: SNACKBAR_ID,
      component: <Snackbar {...snackbarOptions}>{text}</Snackbar>,
      options: {
        disableInteraction: false,
      },
    });
  };

  return handleOpenSnackbar;
};
