import { create } from "zustand";
import { useState } from "react";

export interface OverlayOptions {
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
