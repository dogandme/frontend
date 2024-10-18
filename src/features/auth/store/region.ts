import { useContext } from "react";
import { create, useStore } from "zustand";
import { LatLng, Region } from "../api/region";
import { RegionModalStoreContext } from "../ui/regionModal";

interface RegionModalInternalState {
  keyword: string;
  position: LatLng;
  origin: "keyword" | "position";
}

export interface RegionModalExternalState {
  regionList: Region[];
}

type RegionModalState = RegionModalInternalState & RegionModalExternalState;

interface RegionModalAction {
  setKeyword: (keyword: string) => void;
  setPosition: (position: LatLng) => void;
  setOrigin: (origin: "keyword" | "position") => void;
  setRegionList: (regionList: Region[]) => void;
}

export const createRegionModalStore = (
  initialState?: RegionModalExternalState,
) => {
  return create<RegionModalState & RegionModalAction>((set) => ({
    keyword: "",
    position: { lat: 0, lng: 0 },
    origin: "keyword",
    regionList: initialState?.regionList || [],

    setKeyword: (keyword) => set({ keyword }),
    setPosition: (position) => set({ position }),
    setOrigin: (origin) => set({ origin }),
    setRegionList: (regionList) => set({ regionList }),
  }));
};

export type RegionModalStore = ReturnType<typeof createRegionModalStore>;

export const useRegionModalStore = <T>(
  selector: (state: RegionModalState & RegionModalAction) => T,
): T => {
  const store = useContext(RegionModalStoreContext);
  if (!store) {
    throw new Error(
      "useRegionModalStore 는 RegionModalStoreProvider 내부에서만 사용 가능 합니다.",
    );
  }

  return useStore(store, selector);
};

export const useRegionModalContext = () => {
  const store = useContext(RegionModalStoreContext);
  if (!store) {
    throw new Error(
      "useRegionModalStore 는 RegionModalStoreProvider 내부에서만 사용 가능 합니다.",
    );
  }
  return store;
};
