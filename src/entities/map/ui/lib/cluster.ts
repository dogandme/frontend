interface LatLng {
  lat: number;
  lng: number;
}

class Cluster<T extends LatLng> {
  private markerBuffer: T[] = [];
  markers: T[];
  mean: LatLng = { lat: 0, lng: 0 };
  var: LatLng = { lat: 0, lng: 0 };
  std: LatLng = { lat: 0, lng: 0 };

  constructor({ lat, lng }: T) {
    this.mean = { lat, lng };
    this.markers = [];
  }
  /**
   * 마커에 대해 맨하탄 거리를 계산하고 클러스터 디스턴스 맵에 저장 합니다.
   */
  calculateDistance({ lat, lng }: LatLng) {
    return Math.abs(this.mean.lat - lat + this.mean.lng - lng);
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
  recalculateCenter() {
    // 재조정 전 버퍼에 있던 마커 리스트를 복사하고 버퍼를 초기화 합니다.
    this.markers = [...this.markerBuffer];
    this.markerBuffer = [];
    // 재조정 전 클러스터의 중심점을 캐싱 합니다.
    const prevLatLng = { ...this.mean };

    this.mean = { lat: 0, lng: 0 };
    this.var = { lat: 0, lng: 0 };

    this.markers.forEach(({ lat, lng }) => {
      this.mean.lat += lat / this.markers.length;
      this.mean.lng += lng / this.markers.length;
    });

    this.var = {
      lat: this.markers.reduce(
        (variance, { lat }) =>
          variance + (lat - this.mean.lat) ** 2 / this.markers.length,
        0,
      ),
      lng: this.markers.reduce(
        (variance, { lng }) =>
          variance + (lng - this.mean.lng) ** 2 / this.markers.length,
        0,
      ),
    };

    this.std = {
      lat: Math.sqrt(this.var.lat),
      lng: Math.sqrt(this.var.lng),
    };
    return prevLatLng.lat !== this.mean.lat || prevLatLng.lng !== this.mean.lng;
  }
}

export const kMeansClustering = <T extends LatLng>(
  NumOfCluster: number,
  markers: T[],
) => {
  // K개의 클러스터를 생성합니다.
  // TODO 휴리스틱한 방식으로 초기값 뽑기
  const clusters = Array.from({ length: NumOfCluster }, () => {
    const randomIndex = Math.floor(Math.random() * markers.length);
    return new Cluster(markers[randomIndex]);
  });

  let isChanged = true;
  while (isChanged) {
    markers.forEach((marker) => {
      let minDistance = 9999999999;
      let minClusterIndex = -1;
      // cluster에 대해 맨하탄 거리를 계산하고 가장 가까운 클러스터를 찾습니다.
      clusters.forEach((cluster, index) => {
        const distance = cluster.calculateDistance(marker);
        if (distance < minDistance) {
          minDistance = distance;
          minClusterIndex = index;
        }
      });
      // 가장 가까운 클러스터에게 마커를 추가합니다.
      clusters[minClusterIndex].addMarker(marker);
    });
    // 클러스터의 중심점을 재조정합니다.
    // 이 때 모든 클러스터의 중심점이 재조정 되지 않았다면 반복문을 종료 합니다.
    isChanged = clusters.reduce(
      (isChanged, cluster) => isChanged || cluster.recalculateCenter(),
      false,
    );
  }
  return clusters;
};
