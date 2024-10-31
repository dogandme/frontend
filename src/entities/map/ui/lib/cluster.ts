import { type Bounds, useGetMapCurrentBounds } from "@/features/map/hooks";

interface LatLng {
  lat: number;
  lng: number;
}

class Cluster<T extends LatLng> {
  private LatLngBuffer: T[] = [];
  private outlierBuffer: T[] = [];

  outliers: T[] = [];
  markers: T[];
  center: LatLng = { lat: 0, lng: 0 };
  private bounds: Bounds;

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
  addLatLng(LatLng: T) {
    const { lat, lng } = LatLng;
    // 초기 시행 시에는 따로 Z-Score를 계산하지 않습니다.
    if (this.std.lat === 0 || this.std.lng === 0) {
      this.LatLngBuffer.push(LatLng);
      return;
    }
    const zScore = this.getZScore({ lat, lng });
    /**
     * 새로운 군집을 형성 하기 위해 버퍼에 추가합니다.
     * 이 때 새로운 군집을 형성하는 기준은 이상값이 아닌 마커들로 구성된 군집입니다.
     */
    if (zScore.lat < 3 || zScore.lng < 3) {
      this.LatLngBuffer.push(LatLng);
      return;
    }
    this.outlierBuffer.push(LatLng);
  }
  /**
   * 마커의 중심점을 재조정 합니다.
   * 이 때 마커의 중심점이 변경되었다면 true를 반환 합니다.
   */
  revalidateCluster() {
    // 재조정 전 버퍼에 있던 마커 리스트를 복사하고 버퍼를 초기화 합니다.
    this.markers = [...this.LatLngBuffer];
    this.LatLngBuffer = [];
    // 재조정 전 버퍼에 있던 이상값 리스트를 복사하고 버퍼를 초기화 합니다.
    this.outliers = [...this.outlierBuffer];
    this.outlierBuffer = [];
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

    return (
      prevCenter.lat === this.center.lat || prevCenter.lng === this.center.lng
    );
  }
}

export const useKMeansClustering = <T extends LatLng>(
  NumOfCluster: number,
  markers?: T[],
) => {
  const getCurrentBounds = useGetMapCurrentBounds();
  const bounds = getCurrentBounds();
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
    markers.forEach((LatLng) => {
      const [, closestClusterIndex] = clusters.reduce(
        ([minDistance, minClusterIndex], cluster, index) => {
          const distance = cluster.calculateDistance(LatLng);
          return distance < minDistance
            ? [distance, index]
            : [minDistance, minClusterIndex];
        },
        [Infinity, -1],
      );
      // 가장 가까운 클러스터에게 마커를 추가합니다.
      clusters[closestClusterIndex].addLatLng(LatLng);
    });
    // 클러스터의 중심점을 재조정합니다.
    // 이 때 모든 클러스터의 중심점이 재조정 되지 않았다면 반복문을 종료 합니다.
    isChanged = clusters.reduce(
      (isChanged, cluster) => isChanged && cluster.revalidateCluster(),
      false,
    );
  }
  return clusters;
};
