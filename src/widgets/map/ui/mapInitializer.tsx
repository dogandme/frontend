import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import {
  useCurrentLocation,
  useGetMapCurrentBounds,
  useMapQueryParams,
} from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";

export const MapInitializer = () => {
  const map = useMap();

  const { loading, setCurrentLocation } = useCurrentLocation();

  const { boundsParams, hasBoundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const getMapBounds = useGetMapCurrentBounds();

  const isMapIdle = useMapStore((state) => state.isIdle);
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  useEffect(() => {
    if (!map || !isMapIdle) return;

    // map 인스턴스가 생기고 나서, 현재 위치를 가져옵니다.
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude, longitude } = coords;

        const currentLocationOfUser = { lat: latitude, lng: longitude };

        // /map으로 접속했을 때, 현재 위치로 query string를 설정합니다.
        if (!hasBoundsParams) {
          map.setCenter(currentLocationOfUser);

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);

          // todo 내 마킹일 경우 파라미터 처리
          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: "POPULARITY",
          });
        }
      },
      onError: () => {
        if (!hasBoundsParams) {
          // todo 내 마킹일 경우 파라미터 처리
          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: "POPULARITY",
          });
        }
      },
    });

    if (!hasBoundsParams) return;

    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      boundsParams;

    map.fitBounds({
      south: southWestLat,
      west: southWestLng,
      north: northEastLat,
      east: northEastLng,
    });

    // todo 내 마킹일 경우 파라미터 처리
    setMapQueryParams({
      bounds: getMapBounds(),
      sortType: sortTypeParam || "POPULARITY",
    });
  }, [map, isMapIdle]);

  if (!map || loading || !isMapIdle) {
    return <CurrentLocationLoading />;
  }

  return null;
};
