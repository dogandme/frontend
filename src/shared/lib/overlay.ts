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
  const id = Math.random();

  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  const onClose = async () => {
    const flag = await beforeClose?.();
    if (flag) {
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
