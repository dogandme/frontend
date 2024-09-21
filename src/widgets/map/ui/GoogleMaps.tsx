import React, { useEffect } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "@/features/map/constants";
import { useMapStore } from "@/features/map/store/map";
import { debounce } from "@/shared/lib";
import { mapOptions } from "../constants";

const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

interface GoogleMapProps {
  children: React.ReactNode;
}

/**
 * 기본적으로 GoogleMaps 는 w-full h-full relative로 설정 되어 있습니다.
 */
export const GoogleMaps = ({ children }: GoogleMapProps) => {
  const setMapInfo = useMapStore((state) => state.setMapInfo);
  const setUserInfo = useMapStore((state) => state.setUserInfo);

  const DELAY_SET_MAP_INFO = 500;
  const handleMapChange = debounce(({ detail }: MapCameraChangedEvent) => {
    const { bounds, center, zoom } = detail;
    setMapInfo({ bounds, center, zoom });
  }, DELAY_SET_MAP_INFO);

  // 해당 useEffect는 Google Maps API를 사용할 때, 기본적으로 제공되는 outline을 제거하기 위한 코드입니다.
  // 기본 outline에 해당하는 div 태그는 iframe 태그 다음에 존재하고 있습니다.
  // iframe의 경우 기본 마운트보다 늦게 마운트 되기 때문에 interval을 이용해 iframe을 찾을 때 까지 비동기적으로 반복합니다.
  useEffect(() => {
    const interval = setInterval(() => {
      const $iframe = document.querySelector("iframe");
      if (!$iframe) {
        return;
      }
      const $defaultOutline = $iframe.nextElementSibling as HTMLDivElement;
      if ($defaultOutline) {
        $defaultOutline.style.display = "none";
        $defaultOutline.onfocus = () => {}; // onFocus 이벤트를 빈 함수로 설정하여 outline을 제거합니다.
        $defaultOutline.onblur = () => {}; // onBlur 이벤트를 빈 함수로 설정하여 outline을 제거합니다.
        clearInterval(interval);
      }
    }, 100);

    // 첫 렌더링 이후 사용자의 위치 정보를 불러와 useMapStore의 userInfo에 저장합니다.
    const successCallback = ({ coords }: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = coords;
      setUserInfo({
        userLocation: { lat, lng },
        hasLocationPermission: true,
      });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      switch (error.code) {
        case 1 /* PERMISSION_DENIED */:
          throw new Error(
            "내 위치 제공이 거부되었습니다\n내 위치 기반 서비스 이용에 제한이 있을 수 있습니다",
          );

        case 2 /* POSITION_UNAVAILABLE */:
          throw new Error(
            "위치 정보를 사용할 수 없습니다\n잠시 후 다시 시도해주세요",
          );

        case 3 /* TIMEOUT */:
          throw new Error(
            "위치 정보를 가져오는데 시간이 너무 오래 걸립니다\n잠시 후 다시 시도해주세요.",
          );
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    };

    window.navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options,
    );
  }, [setUserInfo]);

  return (
    <Map
      mapId={GOOGLE_MAPS_MAP_ID}
      options={mapOptions}
      // TODO 상태 붙혀서 default Center 이동시키기
      defaultCenter={MAP_INITIAL_CENTER}
      defaultZoom={MAP_INITIAL_ZOOM}
      reuseMaps // Map 컴포넌트가 unmount 되었다가 다시 mount 될 때 기존의 map instance 를 재사용 하여 memory leak을 방지합니다.
      // debounce 를 이용하여 MapStore 의 mapInfo 를 변경합니다.
      onCameraChanged={handleMapChange}
    >
      {children}
    </Map>
  );
};
