import { create } from "zustand";

type Mode = "view" | "add";

interface MapState {
  mode: Mode;
}

interface MapActions {
  setMode: (mode: Mode) => void;
}

const mapStoreInitialState: MapState = {
  mode: "view",
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setMode: (mode) => set({ mode }),
}));
