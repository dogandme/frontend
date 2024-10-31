import { create } from "zustand";

type StopCloseFlag = void | boolean | null;

export interface OverlayOptions {
  disableInteraction?: boolean;
  // beforeClose 는 close 단계를 시행 할지 말지를 나타내는 StopCloseFlag 를 반환합니다.
  // 만약 StopCloseFlag 가 true 라면  close 단계를 시행하지 않습니다.
  beforeClose?: () => StopCloseFlag | Promise<StopCloseFlag>;
  afterClose?: () => void | Promise<void>;
}

export interface OverlayInfo {
  id: number;
  component: JSX.Element;
  onClose?: () => Promise<void>;
  options: OverlayOptions;
}

interface OverlayStore {
  overlays: OverlayInfo[];
  addOverlay: (newOverlay: OverlayInfo) => void;
  removeOverlay: (id: number) => void;
  resetOverlays: () => void;
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

  resetOverlays: () => set({ overlays: [] }),
}));
