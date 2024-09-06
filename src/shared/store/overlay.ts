import { create } from "zustand";

export interface OverlayOptions {
  disableInteraction?: boolean;
  closeHandler?: {
    beforeClose?: () => void | Promise<void>;
    afterClose?: () => void | Promise<void>;
  };
}

export interface OverlayInfo {
  id: number;
  component: JSX.Element;
  handleClose: () => Promise<void>;
  options: OverlayOptions;
}

interface OverlayStore {
  overlays: OverlayInfo[];
  addOverlay: (newOverlay: OverlayInfo) => void;
  removeOverlay: (id: number) => void;
}

export const useOverlayStore = create<OverlayStore>((set) => ({
  overlays: [],

  addOverlay: (newOverlay: OverlayInfo) =>
    set(({ overlays }) => ({
      overlays: [...overlays, newOverlay],
    })),

  removeOverlay: (id: number) =>
    set(({ overlays }) => ({
      overlays: overlays.filter((overlay) => overlay.id !== id),
    })),
}));
