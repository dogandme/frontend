/**
 * Google map 에 사용 할 옵션들을 지정한 객체입니다.
 * 사용 가능한 객체들은 다음과 같은 곳에서 확인할 수 있습니다.
 * mapOptions : @https://developers.google.com/maps/documentation/javascript/reference/map?hl=ko&_gl=1*y1qget*_up*MQ..*_ga*MTU1NzczMDk3NS4xNzI1MzU1Mzc5*_ga_NRWSTWS78N*MTcyNTM1NTM3OS4xLjAuMTcyNTM1NTM3OS4wLjAuMA..#MapOptions
 * styles : @https://developers.google.com/maps/documentation/javascript/reference/map?hl=ko&_gl=1*k2t292*_up*MQ..*_ga*MTU1NzczMDk3NS4xNzI1MzU1Mzc5*_ga_NRWSTWS78N*MTcyNTM1NTM3OS4xLjAuMTcyNTM1NTM3OS4wLjAuMA..#MapTypeStyle
 */
export const mapOptions = {
  // 확대 , 축소 , 전체 화면 등과 같은 기본 구글 맵스 UI 제거
  disableDefaultUI: true,

  // 거리뷰 컨트롤 제거
  streetViewControl: false,

  // 지도 타입 컨트롤 제거
  mapTypeControl: false,

  // 지도 축척 컨트롤 제거
  scaleControl: false,

  // 키보드 단축키 제거
  keyboardShortcuts: false,

  // 전체 화면 컨트롤 제거
  fullscreenControl: false,

  // 최대 볼 수 있는 bound 를 대한민국으로 제한
  restriction: {
    latLngBounds: {
      north: 38.634,
      south: 33.0,
      east: 131.0,
      west: 124.0,
    },
    strictBounds: true,
  },

  /**
   * TODO 상의 후 픽스하기
   */
  maxZoom: 18, // 최대 줌 레벨
  minZoom: 10, // 최소 줌 레벨
  // TODO 상의 후 픽스하기

  // 지도 회전 기능 제거 , 지도를 회전하면 우리의 마커들이 모두 같이  회전 되나 ?
  headingInteractionEnabled: false,

  // 카메라 기울기 제어
  tiltInteractionEnabled: false, // 사용자가 카메라 기울기를 조정 할 수 없도록 설정, 기울기를 조정하면 마커들이 어떻게 기울어질까 ?

  // 모든 제스처를 활성화합니다. 사용자는 한 손가락으로 드래그하고, 두 손가락으로 확대/축소할 수 있습니다.
  gestureHandling: "greedy",
};

export const MAP_INITIAL_CENTER = { lat: 37.5665, lng: 126.978 };
export const MAP_INITIAL_ZOOM = 16;
export const MAP_INITIAL_BOUNDS = {
  east: 126.98218424603498,
  north: 37.572444179048894,
  south: 37.56055534657849,
  west: 126.97381575396503,
};

export const MAP_ENDPOINT = {
  REVERSE_GEOCODING: ({ lat, lng }: { lat: number; lng: number }) =>
    `http://localhost:80/maps/reverse-geocoding?lat=${lat}&lng=${lng}`,
  MARKING_SAVE: "http://localhost:80/markings",
  MARKING_TEMP_SAVE: "http://localhost:80/markings/temp",
};

export const POST_VISIBILITY_MAP = {
  "전체 공개": "PUBLIC",
  "팔로우 공개": "FOLLOWERS_ONLY",
  "나만 보기": "PRIVATE",
  "": null,
} as const;

export * from "./message";
