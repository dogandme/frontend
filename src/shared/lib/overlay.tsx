import { useRef, useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";
import { Snackbar, SNACKBAR_ID, SnackBarProps } from "../ui/snackbar";

type UseOverlay = (
  createOverlayComponent: (onClose: () => Promise<void>) => JSX.Element,
  options?: OverlayOptions,
) => {
  handleOpen: () => Promise<void>;
  onClose: () => Promise<void>;
  isOpen: boolean;
};

const generateId = () => window.crypto.getRandomValues(new Uint32Array(1))[0];

export const useOverlay: UseOverlay = (
  createOverlayComponent,
  options = {},
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { disableInteraction = true, beforeClose, afterClose } = options;
  const [id] = useState(() => generateId()); // 불변하는 상태값 생성

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const onClose = async () => {
    const stopCloseFlag = await beforeClose?.();
    if (stopCloseFlag) {
      return;
    }
    removeOverlay(id);
    setIsOpen(false);
    await afterClose?.();
  };

  const handleOpen = async () => {
    addOverlay({
      id,
      component: createOverlayComponent(onClose),
      onClose,
      options: { disableInteraction },
    });
    setIsOpen(true);
  };

  return { handleOpen, onClose, isOpen };
};

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
    // 이 때 다른 스낵바가 열리게 되면 이전에 설정한 타이머를 초기화 하고 재설정 합니다.
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

export const useModal: UseOverlay = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: true,
    ...options,
  });
};
