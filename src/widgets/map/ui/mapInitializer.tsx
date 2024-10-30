import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { sortTypeMap } from "@/features/map/constants";
import { useCurrentLocation } from "@/features/map/hooks";
import { useResearchMarkingList } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";
import { SortType } from "@/entities/marking/api";

export const MapInitializer = () => {
  const map = useMap();

  const { loading, setCurrentLocation } = useCurrentLocation();
  const {
    researchMarkingList,
    bounds: boundsParams,
    sortType: sortTypeParam,
  } = useResearchMarkingList();

  const isMapIdle = useMapStore((state) => state.isIdle);
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  useEffect(() => {
    if (!map || !isMapIdle) return;

    const hasSortTypeParam = !!sortTypeParam && sortTypeParam in sortTypeMap;

    const filterOptions = {
      sortType: hasSortTypeParam ? (sortTypeParam as SortType) : "RECENT",
    };

    // map 인스턴스가 생기고 나서, 현재 위치를 가져옵니다.
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude, longitude } = coords;

        const currentLocationOfUser = { lat: latitude, lng: longitude };

        // /map으로 접속했을 때, 현재 위치로 query string를 설정합니다.
        if (!boundsParams) {
          map.setCenter(currentLocationOfUser);

          setTimeout(() => {
            setIsCenteredOnMyLocation(true);
          }, 0);

          researchMarkingList(filterOptions);
        }
      },
      onError: () => {
        if (!boundsParams) {
          researchMarkingList(filterOptions);
        }
      },
    });

    if (!boundsParams) return;

    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      boundsParams;

    map.fitBounds({
      south: southWestLat,
      west: southWestLng,
      north: northEastLat,
      east: northEastLng,
    });

    researchMarkingList(filterOptions);
  }, [map, isMapIdle]);

  if (!map || loading || !isMapIdle) {
    return <CurrentLocationLoading />;
  }

  return null;
};
