import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "@/features/map/constants";
import { useCurrentLocation } from "@/features/map/lib";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";

export const MapInitializer = () => {
  const map = useMap();
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, setCurrentLocation } = useCurrentLocation();

  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );
  const setMapInfo = useMapStore((state) => state.setMapInfo);

  useEffect(() => {
    if (!map) return;

    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const zoomParam = searchParams.get("zoom");

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
          setMapInfo({ center: currentLocationOfUser, zoom: MAP_INITIAL_ZOOM });

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);
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

  if (!map || loading) {
    return <CurrentLocationLoading />;
  }

  return null;
};
