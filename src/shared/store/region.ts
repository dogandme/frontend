import { create } from "zustand";
import type { LatLng } from "../api";

interface RegionModalState {
  keyword: string;
  position: LatLng;
  origin: "keyword" | "position";
}

interface RegionModalActions {
  setKeyword: (keyword: string) => void;
  setPosition: (position: LatLng) => void;
  setOrigin: (origin: "keyword" | "position") => void;
  resetRegionModalStore: () => void;
}

const addressModalInitialState: RegionModalState = {
  keyword: "",
  position: { lat: 0, lng: 0 },
  origin: "keyword",
};

export const useRegionModalStore = create<
  RegionModalState & RegionModalActions
>((set) => ({
  ...addressModalInitialState,

  setKeyword: (keyword) => set({ keyword }),
  setPosition: (position) => set({ position }),
  setOrigin: (origin) => set({ origin }),
  resetRegionModalStore: () => set(addressModalInitialState),
}));
