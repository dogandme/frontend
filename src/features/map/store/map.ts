import { create } from "zustand";

export interface LatLng {
  lat: number;
  lng: number;
}
export interface MapInfo {
  center: LatLng;
  zoom: number;
}
type Mode = "view" | "add";

interface UserInfo {
  currentLocation: {
    lat: number | null;
    lng: number | null;
  };
  hasLocationPermission: boolean;
}

interface MapState {
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
  isLastSearchedLocation: boolean;
}

interface MapActions {
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
  setIsLastSearchedLocation: (isLastSearchedLocation: boolean) => void;
}

const mapStoreInitialState: MapState = {
  userInfo: {
    currentLocation: { lat: null, lng: null },
    hasLocationPermission: false,
  },
  mode: "view",
  isCenterOnMyLocation: false,
  isLastSearchedLocation: true,
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setUserInfo: (userInfo) => set({ userInfo }),
  setMode: (mode) => set({ mode }),
  setIsCenterOnMyLocation: (isCenterOnMyLocation) =>
    set({ isCenterOnMyLocation }),
  setIsLastSearchedLocation: (isLastSearchedLocation) =>
    set({ isLastSearchedLocation }),
}));
