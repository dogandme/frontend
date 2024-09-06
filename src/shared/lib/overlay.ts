import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

export const useOverlay = (
  createOverlayComponent: (handleClose: () => Promise<void>) => JSX.Element,
  options: OverlayOptions = {
    disableInteraction: true,
    closeHandler: undefined,
  },
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { closeHandler } = options;
  const id = new Date().getTime(); // 커스텀 훅이 호출 될 때 마다 유일한 id를 생성합니다.

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const handleClose = async () => {
    await closeHandler?.beforeClose?.();
    removeOverlay(id);
    setIsOpen(false);
    await closeHandler?.beforeClose?.();
  };

  const handleOpen = async () => {
    addOverlay({
      id,
      component: createOverlayComponent(handleClose),
      handleClose,
      options: { disableInteraction: true, ...options },
    });
    setIsOpen(true);
  };

  return { handleOpen, handleClose, isOpen };
};
