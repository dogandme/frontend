import { useState } from "react";
import { type OverlayOptions, useOverlayStore } from "../store/overlay";

export type CreateOverlayComponent = (
  onClose: () => Promise<void>,
) => JSX.Element;

export type UseModal = (
  createOverlayComponent: CreateOverlayComponent,
  options?: Omit<OverlayOptions, "disableInteraction">,
) => {
  handleOpen: () => Promise<void>;
  onClose: () => Promise<void>;
  isOpen: boolean;
};

export const useModal: UseModal = (createOverlayComponent, options = {}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { beforeClose, afterClose } = options;
  const [id] = useState(
    () => window.crypto.getRandomValues(new Uint32Array(1))[0],
  ); // 불변하는 상태값 생성

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const onClose = async () => {
    const stopCloseFlag = await beforeClose?.();
    if (stopCloseFlag) {
      return;
    }
    removeOverlay(id);
    setIsOpen(false);
    afterClose?.();
  };

  const handleOpen = async () => {
    addOverlay({
      id,
      component: createOverlayComponent(onClose),
      onClose,
      options: { disableInteraction: true },
    });
    setIsOpen(true);
  };

  return { handleOpen, onClose, isOpen };
};
