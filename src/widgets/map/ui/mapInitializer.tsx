import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { MAP_INITIAL_BOUNDS } from "@/features/map/constants";
import {
  useCurrentLocation,
  useGetMapCurrentBounds,
  useMapMode,
  useMapQueryParams,
  usePlaceQueryParams,
} from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { CurrentLocationLoading } from "@/entities/map/ui";
import { Marking } from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useSnackBar } from "@/shared/lib";

interface MarkingInfo {
  position: {
    lat: Marking["lat"];
    lng: Marking["lng"];
  };
  markingId: Marking["markingId"];
}

export const MapInitializer = () => {
  const location = useLocation();
  const { state, pathname } = location;

  const navigate = useNavigate();

  const map = useMap();
  const mapMode = useMapMode();

  const { loading, setCurrentLocation } = useCurrentLocation();

  const { boundsParams, hasBoundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const { placeParams, setPlaceQueryParams } = usePlaceQueryParams();
  const getMapBounds = useGetMapCurrentBounds();

  const handleOpen = useSnackBar();

  const isMapIdle = useMapStore((state) => state.isIdle);
  const setIsMapIdle = useMapStore((state) => state.setIsIdle);
  const setIsCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  // 해당 이펙트는 /:nickname 에서 state 를 통해 마킹 정보를 전달 받은 경우 실행됩니다.
  // state.markingInfo.position 으로 맵을 이동 시킨 후 해당 위치의 마킹을 불러옵니다.
  // ! state 를 유지 한 채로 initialize 하기 위해 navigate 를 사용하여 초기화 합니다.
  useEffect(() => {
    if (!state || !state.markingInfo || !isMapIdle || !map) {
      return;
    }

    (async function () {
      const { position } = state.markingInfo as MarkingInfo;

      await map.setCenter(position);
      const bounds = map.getBounds();
      const newSearchParams = new URLSearchParams({
        // bounds 에 에 대한 searchParams
        boundsNELat: bounds.getNorthEast().lat().toString(),
        boundsNELng: bounds.getNorthEast().lng().toString(),
        boundsSWLat: bounds.getSouthWest().lat().toString(),
        boundsSWLng: bounds.getSouthWest().lng().toString(),
        // 정렬에 대한 searchParams
        sortType: pathname === ROUTER_PATH.MY_MARK ? "RECENT" : "POPULARITY",
      });
      // 이 장소 마킹에서는 lat , lng 에 대한 서치 파라미터도 업데이트 합니다.
      if (pathname === ROUTER_PATH.PLACE) {
        newSearchParams.set("lat", position.lat.toString());
        newSearchParams.set("lng", position.lng.toString());
      }

      navigate(
        {
          ...location,
          search: newSearchParams.toString(),
        },
        {
          state,
        },
      );
    })();
  }, [map, isMapIdle, state]);

  // 해당 이펙트는 Link 나 navigate 등으로 라우팅 될 때 router state 가 존재하지 않는 경우 실행됩니다.
  // 즉 , 초기진입 했을 때에만 실행 됩니다.
  // boundsParams 를 적절한 값으로 업데이트 합니다.
  useEffect(() => {
    if (!map || !isMapIdle || state) return;

    const defaultSortType = mapMode === "MY_MARK" ? "RECENT" : "POPULARITY";

    // boundsParams 가 존재할 경우 해당 boundsParams 로 맵을 이동 시킨 후 boundsParams 를 변경합니다.
    // 기기마다 boundsParams가 다르게 나올 수 있기 때문에 비동기적으로 동기화 과정을 거칩니다.
    if (hasBoundsParams) {
      (async function () {
        const { northEastLat, northEastLng, southWestLat, southWestLng } =
          boundsParams;

        await map.fitBounds({
          south: southWestLat,
          west: southWestLng,
          north: northEastLat,
          east: northEastLng,
        });

        setMapQueryParams({
          bounds: getMapBounds(),
          sortType: sortTypeParam ?? defaultSortType,
        });
      })();
      return;
    }

    // 만약 boundsParams가 없다면 사용자의 현재 위치로 boundsParams 를 설정합니다.
    // 사용자의 위치를 가져오는데 실패했다면 기본 boundsParams 를 설정합니다.
    setCurrentLocation({
      onSuccess: async ({ coords }) => {
        const { latitude, longitude } = coords;
        const currentLocationOfUser = { lat: latitude, lng: longitude };

        await map.setCenter(currentLocationOfUser);

        setIsCenteredOnMyLocation(true);
        setMapQueryParams({
          bounds: getMapBounds(),
          sortType: defaultSortType,
        });
      },
      onError: async () => {
        await map.fitBounds(MAP_INITIAL_BOUNDS);

        setMapQueryParams({
          bounds: getMapBounds(),
          sortType: defaultSortType,
        });
      },
    });

    return () => {
      setIsMapIdle(false);
    };
  }, [map, isMapIdle]);

  // 해당 이펙트는 place가 ROUTER_PATH.PLACE 면서 state가 없을 때 실행됩니다.
  // 이펙트의 용도는 placeParams의 값이 존재하지 않거나 boundsParams의 범위를 벗어난 경우에 placeParams 값을 boundsParams의 중심으로 설정하기 위함입니다.
  useEffect(() => {
    if (ROUTER_PATH.PLACE !== pathname || state) {
      return;
    }

    const { southWestLat, northEastLat, southWestLng, northEastLng } =
      boundsParams;

    if (!(southWestLat && northEastLat && southWestLng && northEastLng)) {
      return;
    }

    const { lat, lng } = placeParams;

    if (!(southWestLat && northEastLat && southWestLng && northEastLng)) {
      return;
    }

    if (
      lat &&
      lng &&
      lat >= southWestLat &&
      lat <= northEastLat &&
      lng >= southWestLng &&
      lng <= northEastLng
    ) {
      return;
    }

    setPlaceQueryParams({
      lat: (southWestLat + northEastLat) / 2,
      lng: (southWestLng + northEastLng) / 2,
    });
  }, [pathname, state, boundsParams]);

  // 해당 이펙트는 Link 나 navigate 등으로 라우팅 될 때 router state 가 존재하지 않는 경우 실행됩니다.
  // 즉 , 초기진입 했을 때에만 실행 됩니다.
  useEffect(() => {
    if (!hasBoundsParams || state) {
      return;
    }
    handleOpen("스팟을 발견하고 마킹으로 추억을 남겨보세요", { type: "map" });
  }, [hasBoundsParams, state]);

  if (!map || loading || !isMapIdle) {
    return <CurrentLocationLoading />;
  }

  return null;
};
