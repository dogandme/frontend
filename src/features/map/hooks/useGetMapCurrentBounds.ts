import { useMap } from "@vis.gl/react-google-maps";

export interface Bounds {
  northEastLat: number | null;
  northEastLng: number | null;
  southWestLat: number | null;
  southWestLng: number | null;
}

export const useGetMapCurrentBounds = () => {
  const map = useMap();

  const nullBounds = {
    northEastLat: null,
    northEastLng: null,
    southWestLat: null,
    southWestLng: null,
  };

  const getCurrentBounds = (): Bounds => {
    if (!map) return nullBounds;

    const bounds = map.getBounds();

    if (!bounds) return nullBounds;

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const northEastLat = northEast.lat();
    const northEastLng = northEast.lng();
    const southWestLat = southWest.lat();
    const southWestLng = southWest.lng();

    return {
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng,
    };
  };

  return getCurrentBounds;
};
