import { create } from "zustand";
import {
  MAP_INITIAL_BOUNDS,
  MAP_INITIAL_CENTER,
  MAP_INITIAL_ZOOM,
} from "../constants";
import { Bounds } from "../hooks";

export interface LatLng {
  lat: number;
  lng: number;
}
export interface MapInfo {
  center: LatLng;
  zoom: number;
  bounds: NonNullableBounds;
}
type Mode = "view" | "add";

interface UserInfo {
  currentLocation: {
    lat: number | null;
    lng: number | null;
  };
  hasLocationPermission: boolean;
}

export type NonNullableBounds = {
  [key in keyof Bounds]: NonNullable<Bounds[key]>;
};

interface MapState {
  isIdle: boolean;
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
  isLastSearchedLocation: boolean;
  mapInfo: MapInfo;
}

interface MapActions {
  setIsIdle: (isIdle: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
  setIsLastSearchedLocation: (isLastSearchedLocation: boolean) => void;
  setMapInfo: (mapInfo: MapInfo) => void;
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
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
    bounds: {
      northEastLat: MAP_INITIAL_BOUNDS.east,
      northEastLng: MAP_INITIAL_BOUNDS.north,
      southWestLat: MAP_INITIAL_BOUNDS.west,
      southWestLng: MAP_INITIAL_BOUNDS.south,
    },
  },
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
  setMapInfo: (mapInfo) => set({ mapInfo }),
}));
