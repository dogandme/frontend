import { create } from "zustand";
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "../constants";

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
  mapInfo: MapInfo;
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
  isLastSearchedLocation: boolean;
}

interface MapActions {
  setMapInfo: (mapInfo: MapInfo) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
  setIsLastSearchedLocation: (isLastSearchedLocation: boolean) => void;
}

const mapStoreInitialState: MapState = {
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
  },
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
  setMapInfo: (mapInfo) => set({ mapInfo }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setMode: (mode) => set({ mode }),
  setIsCenterOnMyLocation: (isCenterOnMyLocation) =>
    set({ isCenterOnMyLocation }),
  setIsLastSearchedLocation: (isLastSearchedLocation) =>
    set({ isLastSearchedLocation }),
}));
