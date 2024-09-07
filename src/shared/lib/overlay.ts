import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

// TODO overlay 를 사용하는 훅이 대체 되면 export 하지 않기
export const useOverlay = (
  createOverlayComponent: (onClose: () => Promise<void>) => JSX.Element,
  options: OverlayOptions = {},
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

export const useSnackBar = (
  createOverlayComponent: (onClose: () => Promise<void>) => JSX.Element,
  options?: OverlayOptions,
) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: false,
    ...options,
  });
};
