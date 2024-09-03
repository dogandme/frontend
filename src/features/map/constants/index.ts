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

  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [
        {
          weight: "2.00",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#9c9c9c",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          color: "#f2f2f2",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7b7b7b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: "-5",
        },
        {
          lightness: "-3",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "labels.text.stroke",
      stylers: [
        {
          saturation: "28",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#46bcec",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#c8d7d4",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#070707",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
  ],
};
