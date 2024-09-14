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

interface MapState {
  mapInfo: MapInfo;
}

interface MapActions {
  setMapInfo: (mapInfo: MapInfo) => void;
}

const mapStoreInitialState: MapState = {
  mapInfo: {
    center: MAP_INITIAL_CENTER,
    zoom: MAP_INITIAL_ZOOM,
    bounds: MAP_INITIAL_BOUNDS,
  },
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...mapStoreInitialState,
  setMapInfo: (mapInfo) => set({ mapInfo }),
}));
