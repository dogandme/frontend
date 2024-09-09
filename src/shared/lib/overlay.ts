import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

type UseOverlay = (
  createOverlayComponent: (onClose: () => Promise<void>) => JSX.Element,
  options?: OverlayOptions,
) => {
  handleOpen: () => Promise<void>;
  onClose: () => Promise<void>;
  isOpen: boolean;
};

export const useOverlay: UseOverlay = (
  createOverlayComponent,
  options = {},
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { disableInteraction = true, beforeClose, afterClose } = options;
  const id = new Date().getTime(); // 커스텀 훅이 호출 될 때 마다 유일한 id를 생성합니다.

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const onClose = async () => {
    await beforeClose?.();
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

export const useSnackBar: UseOverlay = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: false,
    ...options,
  });
};

/**
 * useModal 의 경우엔 모달간 상호작용을 막기 위해 disableInteraction 을 true 로 설정합니다.
 */
export const useModal: UseOverlay = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: true,
    ...options,
  });
};
