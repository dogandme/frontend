import { create } from "zustand";
import {
  MAP_INITIAL_CENTER,
  MAP_INITIAL_BOUNDS,
  MAP_INITIAL_ZOOM,
} from "../constants";

export interface Bounds {
  east: number;
  north: number;
  south: number;
  west: number;
}
export interface LatLng {
  lat: number;
  lng: number;
}
export interface MapInfo {
  bounds: Bounds;
  center: LatLng;
  zoom: number;
}
type Mode = "view" | "add";

interface UserInfo {
  userLocation: LatLng;
  hasLocationPermission: boolean;
}

interface MapState {
  mapInfo: MapInfo;
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
}

interface MapActions {
  setMapInfo: (mapInfo: MapInfo) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
}

const mapStoreInitialState: MapState = {
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
    bounds: MAP_INITIAL_BOUNDS,
  },
  userInfo: {
    userLocation: MAP_INITIAL_CENTER,
    hasLocationPermission: false,
  },
  mode: "view",
  isCenterOnMyLocation: false,
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setMapInfo: (mapInfo) => set({ mapInfo }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setMode: (mode) => set({ mode }),
  setIsCenterOnMyLocation: (isCenterOnMyLocation) =>
    set({ isCenterOnMyLocation }),
}));
