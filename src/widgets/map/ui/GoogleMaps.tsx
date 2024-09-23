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

  const { userInfo } = useMapStore.getState();

  const debouncedUpdateMapInfo = debounce(
    (detail: MapCameraChangedEvent["detail"]) => {
      const { center, zoom } = detail;
      setMapInfo({ center, zoom });
    },
    DELAY_SET_MAP_INFO,
  );

  const handleMapChange = ({ detail }: MapCameraChangedEvent) => {
    debouncedUpdateMapInfo(detail); // debounce 시켜 MapStore 의 mapInfo 를 변경합니다.

    const { center } = detail;

    const isMapCenteredOnMyLocation =
      userInfo.currentLocation.lat === center.lat &&
      userInfo.currentLocation.lng === center.lng;

    setIsMapCenteredOnMyLocation(isMapCenteredOnMyLocation);
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
    if (!map) return;

    const hasLatLngParams =
      typeof latParam === "string" && typeof lngParam === "string";

    // map 인스턴스가 생기고 나서, 현재 위치를 가져옵니다.
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude, longitude } = coords;

        const currentLocationOfUser = { lat: latitude, lng: longitude };

        // /map으로 접속했을 때, 현재 위치로 query string를 설정합니다.
        if (!hasLatLngParams) {
          setSearchParams({
            lat: latitude.toString(),
            lng: longitude.toString(),
            zoom: MAP_INITIAL_ZOOM.toString(),
          });

          map.setCenter(currentLocationOfUser);
          setMapInfo({
            center: currentLocationOfUser,
            zoom: MAP_INITIAL_ZOOM,
          });
        }
      },
      onError: () => {
        // /map으로 접속했을 때, MAP_INITIAL_CENTER로 query string를 설정합니다.
        // Map 컴포넌트의 default center가 MAP_INITIAL_CENTER이기 때문에 map을 이동시키지 않습니다.
        if (!hasLatLngParams) {
          setSearchParams({
            lat: MAP_INITIAL_CENTER.lat.toString(),
            lng: MAP_INITIAL_CENTER.lng.toString(),
            zoom: MAP_INITIAL_ZOOM.toString(),
          });
        }
      },
    });

    const lat = Number(latParam);
    const lng = Number(lngParam);

    // /map?lat&lng으로 접속했을 때 query string에 zoom을 설정하고, 해당 위치로 이동합니다.
    if (hasLatLngParams && !zoomParam) {
      map.setCenter({ lat, lng });

      setMapInfo({
        center: { lat, lng },
        zoom: MAP_INITIAL_ZOOM,
      });
      setSearchParams({
        lat: latParam,
        lng: lngParam,
        zoom: MAP_INITIAL_ZOOM.toString(),
      });
    }

    // /map?lat&lng&zoom으로 접속했을 때, 해당 위치로 이동합니다.
    if (hasLatLngParams && zoomParam) {
      const zoom = Number(zoomParam);

      map.setCenter({ lat, lng });
      map.setZoom(zoom);

      setMapInfo({ center: { lat, lng }, zoom });
    }
  }, [map]);

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
