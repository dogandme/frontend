import { create } from "zustand";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { LatLng } from "@/entities/map/types/client";
import {
  MAP_INITIAL_BOUNDS,
  MAP_INITIAL_CENTER,
  MAP_INITIAL_ZOOM,
} from "../constants";

export interface MapInfo {
  center: NonNullableObject<LatLng>;
  zoom: number;
  bounds: MapCameraChangedEvent["detail"]["bounds"];
}
type Mode = "view" | "add";

interface UserInfo {
  currentLocation: LatLng;
  hasLocationPermission: boolean;
}

interface MapState {
  isIdle: boolean;
  userInfo: UserInfo;
  mode: Mode;
  isCenterOnMyLocation: boolean;
  mapInfo: MapInfo;
}

interface MapActions {
  setIsIdle: (isIdle: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setMode: (mode: Mode) => void;
  setIsCenterOnMyLocation: (isCenterOnMyLocation: boolean) => void;
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
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
    bounds: MAP_INITIAL_BOUNDS,
  },
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setUserInfo: (userInfo) => set({ userInfo }),
  setMode: (mode) => set({ mode }),
  setIsCenterOnMyLocation: (isCenterOnMyLocation) =>
    set({ isCenterOnMyLocation }),

  setIsIdle: (isIdle) => set({ isIdle }),
  setMapInfo: (mapInfo) => set({ mapInfo }),
}));
