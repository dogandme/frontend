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
  isIdle: boolean;
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
  isLastSearchedLocation: boolean;
  zoom: number;
}

interface MapActions {
  setIsIdle: (isIdle: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
  setIsLastSearchedLocation: (isLastSearchedLocation: boolean) => void;
  setZoom: (zoom: number) => void;
}

const mapStoreInitialState: MapState = {
  isIdle: false,
  userInfo: {
    currentLocation: { lat: null, lng: null },
    hasLocationPermission: false,
  },
  mode: "view",
  isCenterOnMyLocation: false,
  isLastSearchedLocation: true,
  zoom: 15,
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setUserInfo: (userInfo) => set({ userInfo }),
  setMode: (mode) => set({ mode }),
  setIsCenterOnMyLocation: (isCenterOnMyLocation) =>
    set({ isCenterOnMyLocation }),
  setIsLastSearchedLocation: (isLastSearchedLocation) =>
    set({ isLastSearchedLocation }),
  setIsIdle: (isIdle) => set({ isIdle }),
  setZoom: (zoom) => set({ zoom }),
}));
