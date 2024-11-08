import { useRef } from "react";
import { type Bounds } from "@/features/map/hooks";
import { NonNullableBounds, useMapStore } from "@/features/map/store";

interface LatLng {
  lat: number;
  lng: number;
}

export interface Marker extends LatLng {
  markingId: number;
  previewImage: string;
}

export class Cluster<T extends Marker> {
  outliers: T[] = [];
  markers: T[];
  center: LatLng = { lat: 0, lng: 0 };
  // markerBounds는 클러스터링을 시행한 마커들이 존재하는 범위를 의미합니다.
  // bounds는 해당 클러스터 내부 마커들의 바운더리를 의미합니다.
  markerBounds: Bounds;
  bounds: Bounds;
  markerCount: number = 0;
  previewImage: string = "";
  markingId: number = 0;

  private mean: LatLng = {
    lat: 0,
    lng: 0,
  };

  private var: LatLng = {
    lat: 0,
    lng: 0,
  };
  private std: LatLng = {
    lat: 0,
    lng: 0,
  };

  constructor({ lat, lng }: T, markerBounds: Bounds) {
    this.center = { lat, lng };
    this.markers = [];
    this.markerBounds = markerBounds;
    this.bounds = markerBounds;
  }
  clearMarkers() {
    this.markers = [];
    this.outliers = [];
  }
  /**
   * lat , lng 값의 범위가 다르기에 거리 계산 전 표준화를 시행 합니다.
   *
   */
  private minMaxScaling({ lat, lng }: LatLng) {
    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      this.markerBounds;
    if (!northEastLat || !northEastLng || !southWestLat || !southWestLng) {
      return { lat, lng };
    }
    const scaledLat = (lat - southWestLat) / (northEastLat - southWestLat);
    const scaledLng = (lng - southWestLng) / (northEastLng - southWestLng);
    return { lat: scaledLat, lng: scaledLng };
  }
  /**
   * 마커에 대해 맨하탄 거리를 계산하고 클러스터 디스턴스 맵에 저장 합니다.
   */
  calculateDistance({ lat, lng }: LatLng) {
    const scaledLatLng = this.minMaxScaling({ lat, lng });
    const scaledCenter = this.minMaxScaling(this.center);

    return (
      Math.abs(scaledLatLng.lat - scaledCenter.lat) +
      Math.abs(scaledLatLng.lng - scaledCenter.lng)
    );
  }
  /**
   * 정규화 된 값을 이용해 평균 , 분산 , 표준편차를 구합니다.
   * 정규화를 하는 이유는 줌 레벨에 따라 각 마커들의 거리의 범위가 달라지기 때문입니다.
   * 정규화 된 값으로 거리를 계산하면 줌 레벨에 따라 거리의 범위가 일정하게 유지되기에 이상값을 검증하기 위한 지표로 사용 할 수 있습니다.
   */
  private updateStatisticValue() {
    const scaledLatLngList = this.markers.map((LatLng) =>
      this.minMaxScaling(LatLng),
    );

    this.mean = scaledLatLngList.reduce(
      (mean, { lat, lng }) => {
        return {
          lat: mean.lat + lat / this.markers.length,
          lng: mean.lng + lng / this.markers.length,
        };
      },
      { lat: 0, lng: 0 },
    );

    this.var = scaledLatLngList.reduce(
      (variance, { lat, lng }) => {
        return {
          lat:
            variance.lat +
            Math.pow(lat - this.mean.lat, 2) / this.markers.length,
          lng:
            variance.lng +
            Math.pow(lng - this.mean.lng, 2) / this.markers.length,
        };
      },
      { lat: 0, lng: 0 },
    );

    this.std = {
      lat: Math.sqrt(this.var.lat),
      lng: Math.sqrt(this.var.lng),
    };
  }
  private getZScore({ lat, lng }: LatLng) {
    const scaledLatLng = this.minMaxScaling({ lat, lng });
    return {
      lat: Math.abs(scaledLatLng.lat - this.mean.lat) / this.std.lat,
      lng: Math.abs(scaledLatLng.lng - this.mean.lng) / this.std.lng,
    };
  }
  /**
   * 특정 마커를 마커 버퍼에 추가 합니다.
   * 이 때 추가된 마커가 이상값인지 판단하여 이상값 버퍼에 추가 합니다.
   * ! 이상값으로 판단 된 마커는 클러스터 기준으로 이상값일 뿐
   * ! 전체 데이터 기준으로 이상값이라고 판단 할 수 없습니다.
   * ! 오히려 전체 데이터 기준으로 봤을 땐 해당 군집에 어울리는 값일 수 있습니다.
   * ! 이상값을 판단하는 기준은 Z-Score가 3 이상인 경우로 설정 하였습니다. (3시그마 규칙)
   */
  addMarker(marker: T) {
    const { lat, lng } = marker;
    // 초기 시행 시에는 따로 Z-Score를 계산하지 않습니다.
    if (this.std.lat === 0 || this.std.lng === 0) {
      this.markers.push(marker);
      return;
    }
    const zScore = this.getZScore({ lat, lng });
    /**
     * 새로운 군집을 형성 하기 위해 버퍼에 추가합니다.
     * 이 때 새로운 군집을 형성하는 기준은 이상값이 아닌 마커들로 구성된 군집입니다.
     */
    if (zScore.lat > 3 || zScore.lng > 3) {
      this.outliers.push(marker);
      return;
    }
    this.markers.push(marker);
  }
  static getBounds(markers: LatLng[]) {
    const northEast = markers.reduce(
      (prev, { lat, lng }) => ({
        lat: Math.max(prev.lat, lat),
        lng: Math.max(prev.lng, lng),
      }),
      { lat: -Infinity, lng: -Infinity },
    );

    const southWest = markers.reduce(
      (prev, { lat, lng }) => ({
        lat: Math.min(prev.lat, lat),
        lng: Math.min(prev.lng, lng),
      }),
      { lat: Infinity, lng: Infinity },
    );
    return {
      northEastLat: northEast.lat,
      northEastLng: northEast.lng,
      southWestLat: southWest.lat,
      southWestLng: southWest.lng,
    };
  }
  /**
   * 마커의 중심점을 재조정 합니다.
   * 이 때 마커의 중심점이 변경 되었다면 true를 반환 합니다.
   */
  revalidateCluster() {
    // 재조정 전 클러스터의 중심점을 캐싱 합니다.
    const prevCenter = { ...this.center };

    // 클러스터의 마커들을 이용해 새로운 중심점을 계산합니다.
    this.center = this.markers.reduce(
      (center, { lat, lng }) => ({
        lat: center.lat + lat / this.markers.length,
        lng: center.lng + lng / this.markers.length,
      }),
      { lat: 0, lng: 0 },
    );
    // 새로운 중심점을 이용해 통계값을 계산합니다.
    this.updateStatisticValue();

    this.bounds = Cluster.getBounds(this.markers);
    this.markerCount = this.markers.length;
    this.previewImage = this.markers[0]?.previewImage;
    this.markingId = this.markers[0]?.markingId;

    return (
      prevCenter.lat !== this.center.lat || prevCenter.lng !== this.center.lng
    );
  }
}

const CLUSTER_NUM_MAP: { [key: number]: number } = {
  10: 7,
  11: 7,
  12: 8,
  13: 8,
  14: 9,
  15: 9,
  16: 20,
  17: 24,
  18: 34,
  19: 40,
} as const;

type CachedMarkerIdsMap = {
  [key in number]: Record<number, boolean>;
};
type CachedClusterdMarkersMap<T extends Marker> = {
  [key in number]: Cluster<T>[];
};
type CachedSingleMarkersMap<T extends Marker> = {
  [key in number]: T[];
};

export const useKMeansClustering = <T extends Marker>() => {
  const mapInfo = useMapStore((state) => state.mapInfo);
  const { zoom, bounds } = mapInfo;

  const clusterKey = useRef<string>("");
  const cachedMarkerIdsMap = useRef<CachedMarkerIdsMap>({});
  const cachedClusteredMarkersMap = useRef<CachedClusterdMarkersMap<T>>({});
  const cachedSingleMarkersMap = useRef<CachedSingleMarkersMap<T>>({});

  /**
   * 특정 위경도 좌표가 바운더리 내부에 있는지 판단 합니다.
   * 해당 메소드는 클러스터들을 필터링 하거나 , 마커를 필터링 할 때 사용 됩니다.
   */
  const filterInnerBoundary = ({ lat, lng }: LatLng) => {
    const { northEastLat, northEastLng, southWestLat, southWestLng } = bounds;
    return (
      lat >= southWestLat &&
      lat <= northEastLat &&
      lng >= southWestLng &&
      lng <= northEastLng
    );
  };

  /**
   * 인수로 들어온 마커들의 마킹 아이디를 캐싱 합니다.
   * 이후 이전에 캐싱 되지 않았던 새로운 마커들만 필터링 하여 반환합니다.
   */
  const filterNonCachedMarker = <T extends Marker>(markers: T[]): T[] => {
    const previousCachedMarkerIdsMap = { ...cachedMarkerIdsMap.current[zoom] };

    cachedMarkerIdsMap.current[zoom] = {};
    return markers.filter(({ markingId }) => {
      cachedMarkerIdsMap.current[zoom][markingId] = true;
      return !previousCachedMarkerIdsMap[markingId];
    });
  };

  type Serializable =
    | null
    | boolean
    | number
    | string
    | Serializable[]
    | { [key: string]: Serializable };

  type ClusterKey = Serializable | undefined;
  const getClusteredMarkers = (
    markers: T[],
    _clusterKey: ClusterKey = "",
  ): { clusteredMarkers: Cluster<T>[]; singleMarker: T[] } => {
    if (JSON.stringify(_clusterKey) !== clusterKey.current) {
      cachedMarkerIdsMap.current = {};
      cachedClusteredMarkersMap.current = {};
      cachedSingleMarkersMap.current = {};
      clusterKey.current = JSON.stringify(_clusterKey);
    }

    const innerBoundaryMarkers = markers.filter(filterInnerBoundary);
    const nonCachedMarker = filterNonCachedMarker(innerBoundaryMarkers);

    // 이전에 캐싱 해둔 클러스터 중 현재 바운더리 내부에 있는 클러스터만 필터링 합니다.
    cachedClusteredMarkersMap.current[zoom] = cachedClusteredMarkersMap.current[
      zoom
    ]
      ? cachedClusteredMarkersMap.current[zoom].filter(({ center }) =>
          filterInnerBoundary(center),
        )
      : [];

    // 이전에 캐싱 해둔 싱글마커 중 현재 바운더리 내부에 있는 마커만 필터링 합니다.
    cachedSingleMarkersMap.current[zoom] = cachedSingleMarkersMap.current[zoom]
      ? cachedSingleMarkersMap.current[zoom].filter(filterInnerBoundary)
      : [];

    const cachedClusteredMarkers = cachedClusteredMarkersMap.current[zoom];
    const cachedSingleMarkers = cachedSingleMarkersMap.current[zoom];

    if (nonCachedMarker.length === 0) {
      return {
        clusteredMarkers: cachedClusteredMarkers,
        singleMarker: cachedSingleMarkers,
      };
    }

    const numOfCluster = Math.min(
      CLUSTER_NUM_MAP[zoom],
      nonCachedMarker.length,
    );
    const bounds = Cluster.getBounds(nonCachedMarker);

    // K개의 클러스터를 생성합니다.
    // TODO 휴리스틱한 방식으로 초기값 뽑기
    const randomIndexMap: Record<number, boolean> = {};
    const clusters = Array.from({ length: numOfCluster }, () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * nonCachedMarker.length);
      } while (randomIndexMap[randomIndex]);

      randomIndexMap[randomIndex] = true;
      return new Cluster(nonCachedMarker[randomIndex], bounds);
    });

    let isChanged = true;
    while (isChanged) {
      clusters.forEach((cluster) => cluster.clearMarkers());

      nonCachedMarker.forEach((marker) => {
        const [, closestClusterIndex] = clusters.reduce(
          ([minDistance, minClusterIndex], cluster, index) => {
            const distance = cluster.calculateDistance(marker);
            return distance < minDistance
              ? [distance, index]
              : [minDistance, minClusterIndex];
          },
          [Infinity, -1],
        );
        // 가장 가까운 클러스터에게 마커를 추가합니다.
        clusters[closestClusterIndex].addMarker(marker);
      });
      // 클러스터의 중심점을 재조정합니다.
      // 이 때 모든 클러스터의 중심점이 재조정 되지 않았다면 반복문을 종료 합니다.
      isChanged = clusters.some((cluster) => cluster.revalidateCluster());
    }

    // 클러스터링 된 마커들과 단일 마커들을 구분지어 반환 합니다.
    let [clusteredMarkers, singleMarker] = clusters.reduce(
      ([clusteredMarkers, singleMarkers], cluster) => {
        // 줌 레벨이 특정 값 이하일 때는 모든 데이터를 클러스터로 표현합니다.
        if (zoom <= 14) {
          return [[...clusteredMarkers, cluster], singleMarkers];
        }

        if (cluster.markers.length === 1) {
          return [
            clusteredMarkers,
            [...singleMarkers, ...cluster.markers, ...cluster.outliers],
          ];
        }
        return [
          [...clusteredMarkers, cluster],
          [...singleMarkers, ...cluster.outliers],
        ];
      },
      [[], []] as [Cluster<T>[], T[]],
    );

    clusteredMarkers = [...clusteredMarkers, ...cachedClusteredMarkers];
    singleMarker = [...singleMarker, ...cachedSingleMarkers];

    cachedClusteredMarkersMap.current[zoom] = clusteredMarkers;
    cachedSingleMarkersMap.current[zoom] = singleMarker;

    return { clusteredMarkers, singleMarker };
  };

  return getClusteredMarkers;
};
