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
import { useSnackBar } from "@/shared/lib";

export const MapInitializer = () => {
  const map = useMap();
  const mapMode = useMapMode();

  const { loading, setCurrentLocation } = useCurrentLocation();

  const { boundsParams, hasBoundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const getMapBounds = useGetMapCurrentBounds();

  const handleOpen = useSnackBar();

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

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);

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

  useEffect(() => {
    if (!hasBoundsParams) {
      return;
    }
    handleOpen("스팟을 발견하고 마킹으로 추억을 남겨보세요", { type: "map" });
  }, [hasBoundsParams]);

  if (!map || loading || !isMapIdle) {
    return <CurrentLocationLoading />;
  }

  return null;
};
