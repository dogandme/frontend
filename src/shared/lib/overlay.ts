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

const generateId = () => window.crypto.getRandomValues(new Uint32Array(1))[0];

export const useOverlay: UseOverlay = (
  createOverlayComponent,
  options = {},
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { disableInteraction = true, beforeClose, afterClose } = options;
  const id = generateId();

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

export const useSnackBar: UseOverlay = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: false,
    ...options,
  });
};

export const useModal: UseOverlay = (createOverlayComponent, options) => {
  return useOverlay(createOverlayComponent, {
    disableInteraction: true,
    ...options,
  });
};
