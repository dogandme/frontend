import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { filterInnerBoundary } from "@/entities/map/lib";
import { ROUTER_PATH } from "@/shared/constants";
import { getNumberParam, useMapQueryParams } from "./useMapQueryParams";

export const usePlaceQueryParams = () => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { boundsParams, hasBoundsParams } = useMapQueryParams();

  const setPlaceQueryParams = ({ lat, lng }: { lat: number; lng: number }) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("lat", lat.toString());
      newSearchParams.set("lng", lng.toString());
      return newSearchParams;
    });
  };

  const placeParams = {
    lat: getNumberParam("lat", searchParams),
    lng: getNumberParam("lng", searchParams),
  };

  useEffect(() => {
    if (pathname !== ROUTER_PATH.PLACE || !hasBoundsParams) {
      return;
    }
    // searchParameter 에 lat, lng 가 있고, 현재 검색된 boundsParams 내부에 존재하는
    // 유효한 경계값이라면, 해당 값을 사용합니다.
    const lat = getNumberParam("lat", searchParams);
    const lng = getNumberParam("lng", searchParams);
    if (lat && lng && filterInnerBoundary({ lat, lng }, boundsParams)) {
      return;
    }

    // 만약 유효하지 않은 lat , lng 값을 가지고 있는 경우엔 boundsParams 의 중심으로 lat , lng 값을 지정합니다.
    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      boundsParams;

    // hasBoundsParams 가 true 이면 해당 값들은 항상 true 입니다.
    // 타입 단언을 사용하여 값이 존재한다는 것을 명시적으로 표현합니다.

    if (northEastLat && northEastLng && southWestLat && southWestLng) {
      setPlaceQueryParams({
        lat: northEastLat - (northEastLat - southWestLat) / 2,
        lng: northEastLng - (northEastLng - southWestLng) / 2,
      });
    }
  }, [pathname, boundsParams, hasBoundsParams]);

  return { placeParams, setPlaceQueryParams };
};
