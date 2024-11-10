import { useRef } from "react";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { useMapStore } from "@/features/map/store";
import { NUM_OF_TILE_MAP } from "../constants";

/**
 * @description 지도의 경계를 나타내는 타입으로 현재 보고 있는 지도 전체의 바운더리를 의미 합니다.
 */
type MapBounds = MapCameraChangedEvent["detail"]["bounds"];
/**
 * @description 타일의 경계를 나타내는 타입으로 해당 타일의 바운더리를 의미 합니다.
 */
type TileBounds = MapCameraChangedEvent["detail"]["bounds"];
/**
 * @description 마커를 나타내는 타입으로 해당 마커의 위도, 경도, 마킹 아이디, 미리보기 이미지를 의미 합니다.
 */

interface LatLng {
  lat: number;
  lng: number;
}
interface Marker extends LatLng {
  markingId: number;
  previewImage: string;
}

export class Tile {
  bounds: TileBounds;
  markerCount: number = 0;
  position: LatLng = { lat: 0, lng: 0 };

  private totalLat: number = 0;
  private totalLng: number = 0;
  markerMap: Map<Marker["markingId"], boolean> = new Map();

  previewImage: Marker["previewImage"] = "";
  markingId: Marker["markingId"] = 0;

  constructor(bounds: TileBounds) {
    this.bounds = bounds;
  }

  pushMarker({ lat, lng, previewImage, markingId }: Marker) {
    // 처음 삽입되는 마커의 썸네일과 마킹 아이디를 저장 합니다.
    if (this.markerCount < 1) {
      this.previewImage = previewImage;
      this.markingId = markingId;
    }

    this.markerMap.set(markingId, true);
    this.markerCount += 1;
    this.totalLat += lat;
    this.totalLng += lng;
  }

  calculatePosition() {
    if (this.markerCount < 1) {
      return;
    }

    this.position = {
      lat: this.totalLat / this.markerCount,
      lng: this.totalLng / this.markerCount,
    };
  }
}

type TileZoomLevel = keyof typeof NUM_OF_TILE_MAP;
type NumOfTiles = (typeof NUM_OF_TILE_MAP)[TileZoomLevel];

/**
 * TileArea
 * @description 각 타일 별 위도, 경도의 길이를 나타내는 타입입니다.
 */
interface TileArea {
  width: number;
  height: number;
}
const getTileArea = (
  bounds: MapBounds,
  [numOfLowTiles, numOfColTiles]: NumOfTiles,
): TileArea => {
  return {
    width: (bounds.east - bounds.west) / numOfLowTiles,
    height: (bounds.north - bounds.south) / numOfColTiles,
  };
};

/**
 * @description 지도의 바운더리와 타일의 개수를 받아 numOfRowTiles x numOfColTiles 타일을 생성합니다.
 */
const createTiles = (bounds: MapBounds, numOfTiles: NumOfTiles): Tile[][] => {
  const { width, height } = getTileArea(bounds, numOfTiles);
  const [numOfRowTiles, numOfColTiles] = numOfTiles;
  const { west, south } = bounds;

  const createTile = (rowIndex: number, colIndex: number): Tile => {
    return new Tile({
      east: west + width * (rowIndex + 1),
      west: west + width * rowIndex,
      north: south + height * colIndex,
      south: south + height * (colIndex + 1),
    });
  };

  return Array.from({ length: numOfRowTiles }, (_, rowIndex) =>
    Array.from({ length: numOfColTiles }, (_, colIndex) =>
      createTile(rowIndex, colIndex),
    ),
  );
};

/**
 * calculateTileIndex
 * @description 마커의 위도, 경도와 타일의 위도, 경도 길이를 받아 해당 마커가 속한 타일의 인덱스를 반환합니다.
 * 타일의 인덱스를 계산하는 방법은 다음과 같습니다.
 * 1. 전체 맵의 위도로부터 현재 마커의 위도와 경도를 뺍니다. 해당 값은 위경도 시작점으로부터 마커까지의 거리를 나타냅니다.
 * 2. 해당 거리를 타일의 길이로 나눠 몫을 구합니다. 해당 몫은 마커가 속한 타일의 인덱스를 나타냅니다.
 */
const calculateTileIndex = (
  { lat, lng }: Marker,
  { width, height }: TileArea,
  { west, south }: MapBounds,
) => {
  const lngIndex = Math.floor((lng - west) / width);
  const latIndex = Math.floor((lat - south) / height);
  return [lngIndex, latIndex];
};

const filterInnerBoundary = ({ lat, lng }: LatLng, bounds: MapBounds) => {
  return (
    lat < bounds.north &&
    lat > bounds.south &&
    lng < bounds.east &&
    lng > bounds.west
  );
};

const filterIntercsectedTiles = (
  mapBounds: MapBounds,
  bounds: Tile["bounds"],
) => {
  return (
    mapBounds.north > bounds.south &&
    mapBounds.south < bounds.north &&
    mapBounds.east > bounds.west &&
    mapBounds.west < bounds.east
  );
};

type Serializable =
  | null
  | boolean
  | number
  | string
  | Serializable[]
  | { [key: string]: Serializable };

type TilingKey = Serializable | undefined;

export const useTiling = () => {
  const bounds = useMapStore((state) => state.mapInfo.bounds);
  const zoom = useMapStore((state) => state.mapInfo.zoom);

  const tiles = useRef<Tile[][]>([]);
  const cachedTiles = useRef<Tile[]>([]);
  const previousZoom = useRef<number>(zoom);
  const tilingKey = useRef<TilingKey>("");

  /**
   * @description 마커들을 받아 해당 마커들을 타일에 분배합니다.
   * @returns 2차원 배열로 분배된 타일들을 1차원 배열로 반환합니다.
   */
  const getTiles = (_markers: Marker[], _tilingKey = "") => {
    // 만약 줌이 변경된 경우엔 캐시된 타일을 초기화 합니다.
    if (zoom !== previousZoom.current || _tilingKey !== tilingKey.current) {
      cachedTiles.current = [];
    }
    previousZoom.current = zoom;

    const intersectedCachedTiles = cachedTiles.current.filter((tile) =>
      filterIntercsectedTiles(bounds, tile.bounds),
    );

    const innerBoundaryMarkers = _markers.filter((marker) =>
      filterInnerBoundary(marker, bounds),
    );

    const markers = innerBoundaryMarkers.filter(({ markingId }) => {
      return !intersectedCachedTiles.some((tile) =>
        tile.markerMap.has(markingId),
      );
    });

    if (markers.length < 1) {
      return cachedTiles.current;
    }

    const TileZoomLevel = Math.floor(zoom) as TileZoomLevel;
    const numOfTiles = NUM_OF_TILE_MAP[TileZoomLevel];

    const tileArea = getTileArea(bounds, numOfTiles);

    tiles.current = createTiles(bounds, numOfTiles);

    markers.forEach((marker) => {
      const [lngIndex, latIndex] = calculateTileIndex(marker, tileArea, bounds);
      tiles.current[lngIndex][latIndex].pushMarker(marker);
    });

    tiles.current.forEach((tiles) => {
      tiles.forEach((tile) => tile.calculatePosition());
    });

    const newTiles = tiles.current
      .flatMap((tiles) => {
        tiles.forEach((tile) => {
          tile.calculatePosition();
        });

        return tiles;
      })
      .concat(intersectedCachedTiles);

    cachedTiles.current = newTiles;

    return newTiles;
  };

  return getTiles;
};
