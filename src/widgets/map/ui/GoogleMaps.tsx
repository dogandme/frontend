import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "@/features/map/constants";
import { useCurrentLocation } from "@/features/map/lib";
import { useMapStore } from "@/features/map/store/map";
import { debounce } from "@/shared/lib";
import { mapOptions } from "../constants";
import CurrentLocationLoading from "./CurrentLocationLoading";

const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

interface GoogleMapProps {
  children: React.ReactNode;
}

/**
 * 기본적으로 GoogleMaps 는 w-full h-full relative로 설정 되어 있습니다.
 */
export const GoogleMaps = ({ children }: GoogleMapProps) => {
  const setMapInfo = useMapStore((state) => state.setMapInfo);
  const setIsMapCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const DELAY_SET_MAP_INFO = 500;

  const debouncedUpdateMapInfo = debounce(
    (detail: MapCameraChangedEvent["detail"]) => {
      const { bounds, center, zoom } = detail;
      setMapInfo({ bounds, center, zoom });
    },
    DELAY_SET_MAP_INFO,
  );

  const handleMapChange = ({ detail }: MapCameraChangedEvent) => {
    debouncedUpdateMapInfo(detail); // debounce 시켜 MapStore 의 mapInfo 를 변경합니다.
    setIsMapCenteredOnMyLocation(false);
  };

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const zoomParam = searchParams.get("zoom");

  const map = useMap();

  const { loading, setCurrentLocation } = useCurrentLocation();

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
  }, []);

  useEffect(() => {
    const hasLatLngParams = latParam && lngParam;

    if (hasLatLngParams && !zoomParam) {
      setSearchParams({
        lat: latParam,
        lng: lngParam,
        zoom: MAP_INITIAL_ZOOM.toString(),
      });
    }

    if (map) {
      setCurrentLocation({
        onSuccess: (position) => {
          const { latitude, longitude } = position.coords;

          if (!hasLatLngParams) {
            setSearchParams({
              lat: latitude.toString(),
              lng: longitude.toString(),
              zoom: MAP_INITIAL_ZOOM.toString(),
            });

            map.setCenter({ lat: latitude, lng: longitude });
          }
        },
        onError: () => {
          if (!hasLatLngParams)
            setSearchParams({
              lat: MAP_INITIAL_CENTER.lat.toString(),
              lng: MAP_INITIAL_CENTER.lng.toString(),
              zoom: MAP_INITIAL_ZOOM.toString(),
            });
        },
      });
    }

    if (map && hasLatLngParams)
      map.setCenter({ lat: Number(latParam), lng: Number(lngParam) });
  }, [map, latParam, lngParam, zoomParam]);

  return (
    <>
      {loading && <CurrentLocationLoading />}
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
    </>
  );
};
