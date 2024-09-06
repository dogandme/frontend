import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

export const useOverlay = (
  createOverlayComponent: (handleClose: () => Promise<void>) => JSX.Element,
  options: OverlayOptions = {},
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { disableInteraction = true, beforeClose, afterClose } = options;
  const id = new Date().getTime(); // 커스텀 훅이 호출 될 때 마다 유일한 id를 생성합니다.

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const handleClose = async () => {
    await beforeClose?.();
    removeOverlay(id);
    setIsOpen(false);
    await afterClose?.();
  };

  const handleOpen = async () => {
    addOverlay({
      id,
      component: createOverlayComponent(handleClose),
      handleClose,
      options: { disableInteraction },
    });
    setIsOpen(true);
  };

  return { handleOpen, handleClose, isOpen };
};
