import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

export const useOverlay = <T = unknown, V = unknown>(
  createOverlayComponent: (
    handleClose: (closeArgs?: { beforeArgs: T; afterArgs: V }) => Promise<void>,
  ) => JSX.Element,
  options: OverlayOptions = {
    disabledInteraction: true,
    closeHandler: undefined,
  },
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { closeHandler } = options;
  const id = new Date().getTime(); // 커스텀 훅이 호출 될 때 마다 유일한 id를 생성합니다.

  const addOverlays = useOverlayStore((state) => state.addOverlays);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const handleClose = async () => {
    await closeHandler?.beforeClose?.();
    removeOverlay(id);
    setIsOpen(false);
    await closeHandler?.beforeClose?.();
  };

  const handleOpen = async () => {
    addOverlays({
      id,
      component: createOverlayComponent(handleClose),
      handleClose,
      options: { disabledInteraction: true, ...options },
    });
    setIsOpen(true);
  };

  return { handleOpen, handleClose, isOpen };
};
