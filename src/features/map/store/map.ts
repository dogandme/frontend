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

interface MapState {
  mapInfo: MapInfo;
  mode: Mode;
}

interface MapActions {
  setMapInfo: (mapInfo: MapInfo) => void;
  setMode: (mode: Mode) => void;
}

const mapStoreInitialState: MapState = {
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
    bounds: MAP_INITIAL_BOUNDS,
  },
  mode: "view",
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setMapInfo: (mapInfo) => set({ mapInfo }),
  setMode: (mode) => set({ mode }),
}));
