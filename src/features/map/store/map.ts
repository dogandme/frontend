import { create } from "zustand";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import {
  MAP_INITIAL_BOUNDS,
  MAP_INITIAL_CENTER,
  MAP_INITIAL_ZOOM,
} from "../constants";

export interface LatLng {
  lat: number;
  lng: number;
}
export interface MapInfo {
  center: LatLng;
  zoom: number;
  bounds: MapCameraChangedEvent["detail"]["bounds"];
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
  mapInfo: MapInfo;
  searchedBoundary: MapInfo["bounds"];
}

interface MapActions {
  setIsIdle: (isIdle: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
  setIsLastSearchedLocation: (isLastSearchedLocation: boolean) => void;
  setMapInfo: (mapInfo: MapInfo) => void;
  setSearchedBoundary: (searchedBoundary: MapInfo["bounds"]) => void;
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
    bounds: MAP_INITIAL_BOUNDS,
  },
  searchedBoundary: MAP_INITIAL_BOUNDS,
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
  setSearchedBoundary: (searchedBoundary) => set({ searchedBoundary }),
}));
