import { create } from "zustand";

type StopCloseFlag = void | boolean | null;

export interface OverlayOptions {
  disableInteraction?: boolean;
  // beforeClose 는 close 단계를 시행 할지 말지를 나타내는 StopCloseFlag 를 반환합니다.
  // 만약 StopCloseFlag 가 true 라면  close 단계를 시행하지 않습니다.
  beforeClose?: () => StopCloseFlag | Promise<StopCloseFlag>;
  afterClose?: () => void | Promise<void>;
  // 오버레이 선언 시 정적으로 설정 가능한 id 입니다.
  // 해당 id는 useOverlay 를 호출한 컨텍스트 외부에서 해당 id를 가진 오버레이를 제어 할 때 사용합니다.
  staticId?: number;
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
