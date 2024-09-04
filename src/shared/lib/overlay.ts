import { useState } from "react";
import { OverlayOptions, useOverlayStore } from "../store/overlay";

export const useOverlay = (
  createOverlayComponent: (handleClose: () => void) => JSX.Element,
  options: OverlayOptions = { disabledInteraction: true },
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const id = new Date().getTime(); // 커스텀 훅이 호출 될 때 마다 유일한 id를 생성합니다.

  const addOverlays = useOverlayStore((state) => state.addOverlays);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const handleClose = () => {
    removeOverlay(id);
    setIsOpen(false);
  };
  const handleOpen = () => {
    addOverlays({
      id,
      component: createOverlayComponent(handleClose),
      handleClose,
      options,
    });
    setIsOpen(true);
  };

  return { handleOpen, handleClose, isOpen };
};
