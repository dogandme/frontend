import { create } from "zustand";
import { useState } from "react";

interface OverlayOptions {
  disabledInteraction?: boolean;
}

export interface OverlayInfo {
  id: number;
  component: JSX.Element;
  handleClose: () => void;
  options: OverlayOptions;
}

interface OverlayStore {
  overlays: OverlayInfo[];
  addOverlays: (newOverlay: OverlayInfo) => void;
  removeOverlay: (id: number) => void;
}

export const useOverlayStore = create<OverlayStore>((set) => ({
  overlays: [],

  addOverlays: (newOverlay: OverlayInfo) =>
    set(({ overlays }) => ({
      overlays: [...overlays, newOverlay],
    })),

  removeOverlay: (id: OverlayInfo["id"]) =>
    set(({ overlays }) => ({
      overlays: overlays.filter((overlay) => overlay.id !== id),
    })),
}));

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
