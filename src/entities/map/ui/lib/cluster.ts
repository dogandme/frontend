import { Bounds, useResearchMarkingList } from "@/features/map/hooks";

interface LatLng {
  lat: number;
  lng: number;
}
type Marker = LatLng & Record<"markingId", number>;

class Cluster<T extends Marker> {
  private markerBuffer: T[] = [];

  markers: T[];
  center: LatLng = { lat: 0, lng: 0 };
  bounds: Bounds;

  private mean: number = 0;
  private std: number = 0;

  constructor({ lat, lng }: T, bounds: Bounds) {
    this.center = { lat, lng };
    this.markers = [];
    this.bounds = bounds;
  }
  /**
   * lat , lng 값의 범위가 다르기에 거리 계산 전 표준화를 시행 합니다.
   */
  private minMaxScaling({ lat, lng }: LatLng) {
    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      this.bounds;
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
      Math.abs(scaledCenter.lat - scaledLatLng.lat) +
      Math.abs(scaledCenter.lng - scaledLatLng.lng)
    );
  }
  /**
   * 특정 마커를 마커 버퍼에 추가 합니다.
   */
  addMarker(marker: T) {
    this.markerBuffer.push(marker);
  }
  /**
   * 마커의 중심점을 재조정 합니다.
   * 이 때 마커의 중심점이 변경 되지 않았다면 false를 반환합니다.
   */
  revalidateCluster() {
    // 재조정 전 버퍼에 있던 마커 리스트를 복사하고 버퍼를 초기화 합니다.
    this.markers = [...this.markerBuffer];
    this.markerBuffer = [];
    // 재조정 전 클러스터의 중심점을 캐싱 합니다.
    const prevCenter = { ...this.center };

    this.center = this.markers.reduce(
      (center, { lat, lng }) => ({
        lat: center.lat + lat / this.markers.length,
        lng: center.lng + lng / this.markers.length,
      }),
      { lat: 0, lng: 0 },
    );

    this.mean = 0;

    return (
      prevCenter.lat !== this.center.lat || prevCenter.lng !== this.center.lng
    );
  }
}

export const useKMeansClustering = <T extends Marker>(
  NumOfCluster: number,
  markers?: T[],
) => {
  // 표준화를 위해 mix,max lat,lng 값을 구합니다.
  const { bounds } = useResearchMarkingList();
  if (!markers) {
    return [];
  }

  // K개의 클러스터를 생성합니다.
  // TODO 휴리스틱한 방식으로 초기값 뽑기
  const clusters = Array.from({ length: NumOfCluster }, () => {
    const randomIndex = Math.floor(Math.random() * markers.length);
    return new Cluster(markers[randomIndex], bounds);
  });

  let isChanged = true;
  while (isChanged) {
    markers.forEach((marker) => {
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
    isChanged = clusters.reduce(
      (isChanged, cluster) => isChanged || cluster.revalidateCluster(),
      false,
    );
  }
  return clusters;
};
