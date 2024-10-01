import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MAP_INITIAL_ZOOM } from "@/features/map/constants";
import { useCurrentLocation } from "@/features/map/hooks";
import { useResearchMarkingList } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";

export const MapInitializer = () => {
  const map = useMap();

  const { loading, setCurrentLocation } = useCurrentLocation();
  const { researchMarkingList, bounds: boundsParams } =
    useResearchMarkingList();

  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );
  const setMapInfo = useMapStore((state) => state.setMapInfo);

  useEffect(() => {
    if (!map) return;

    // map 인스턴스가 생기고 나서, 현재 위치를 가져옵니다.
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude, longitude } = coords;

        const currentLocationOfUser = { lat: latitude, lng: longitude };

        // /map으로 접속했을 때, 현재 위치로 query string를 설정합니다.
        if (!boundsParams) {
          map.setCenter(currentLocationOfUser);
          setMapInfo({ center: currentLocationOfUser, zoom: MAP_INITIAL_ZOOM });

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);

          researchMarkingList();
        }
      },
      onError: () => {
        if (!boundsParams) {
          researchMarkingList();
        }
      },
    });

    if (!boundsParams) return;

    const { southWest, northEast } = boundsParams;

    map.fitBounds({
      south: southWest.lat,
      west: southWest.lng,
      north: northEast.lat,
      east: northEast.lng,
    });

    const center = map.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const zoom = map.getZoom();

    setMapInfo({
      center: { lat, lng },
      zoom: zoom,
    });

    researchMarkingList();
  }, [map]);

  if (!map || loading) {
    return <CurrentLocationLoading />;
  }

  return null;
};
