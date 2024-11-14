import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import {
  useCurrentLocation,
  useGetMapCurrentBounds,
  useMapMode,
  useMapQueryParams,
} from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";

export const MapInitializer = () => {
  const map = useMap();
  const mapMode = useMapMode();

  const { loading, setCurrentLocation } = useCurrentLocation();

  const { boundsParams, hasBoundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const getMapBounds = useGetMapCurrentBounds();

  const isMapIdle = useMapStore((state) => state.isIdle);
  const setIsMapIdle = useMapStore((state) => state.setIsIdle);
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  useEffect(() => {
    if (!map || !isMapIdle) return;

    const defaultSortType = mapMode === "MY_MARK" ? "RECENT" : "POPULARITY";

    // map 인스턴스가 생기고 나서, 현재 위치를 가져옵니다.
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude, longitude } = coords;

        const currentLocationOfUser = { lat: latitude, lng: longitude };

        if (!hasBoundsParams) {
          map.setCenter(currentLocationOfUser);
          // 현재 위치를 기준으로 중앙에 위치하도록 설정합니다.
          // 원래 setIsCenteredOnMyLocation 의 경우 GoogleMap 컴포넌트 내부의 handleCameraChange 에서 처리하도록 되어 있습니다.
          // 하지만, 초기화 단계에서는 handleCameraChange 가 호출되지 않아서, 초기화 단계에서 처리합니다.
          setIsCenteredOnMyLocation(true);

          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: defaultSortType,
          });
        }
      },
      onError: () => {
        if (!hasBoundsParams) {
          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: defaultSortType,
          });
        }
      },
    });

    if (hasBoundsParams) {
      const { northEastLat, northEastLng, southWestLat, southWestLng } =
        boundsParams;

      map.fitBounds({
        south: southWestLat,
        west: southWestLng,
        north: northEastLat,
        east: northEastLng,
      });

      setMapQueryParams({
        bounds: getMapBounds(),
        sortType: sortTypeParam ?? defaultSortType,
      });
    }

    return () => {
      setIsMapIdle(false);
    };
  }, [map, isMapIdle]);

  if (!map || loading || !isMapIdle) {
    return <CurrentLocationLoading />;
  }

  return null;
};
