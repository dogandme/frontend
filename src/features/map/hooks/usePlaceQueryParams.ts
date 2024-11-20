import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { getNumberParam, useMapQueryParams } from "./useMapQueryParams";

export const usePlaceQueryParams = () => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { boundsParams } = useMapQueryParams();

  const setPlaceQueryParams = ({ lat, lng }: { lat: number; lng: number }) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("lat", lat.toString());
      newSearchParams.set("lng", lng.toString());
      return newSearchParams;
    });
  };

  const lat = getNumberParam("lat", searchParams);
  const lng = getNumberParam("lng", searchParams);

  // lat , lng 로부터 반경 100m의 경계값을 계산합니다.
  // 100m 는 0.0009이기에 중심으로부터 0.00045씩 떨어진 값을 사용합니다.
  const boundsAdjacentPlace = {
    northEastLat: lat && lat + 0.00045,
    northEastLng: lng && lng + 0.00045,
    southWestLat: lat && lat - 0.00045,
    southWestLng: lng && lng - 0.00045,
  };

  useEffect(() => {
    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      boundsParams;

    // 이 장소 마킹이 아니거나 boundsParams 가 유효하지 않은 경우 lat , lng 값을 재조정 하지 않습니다.
    if (
      !(northEastLat && northEastLng && southWestLat && southWestLng) ||
      pathname !== ROUTER_PATH.PLACE
    ) {
      return;
    }

    // 만약 lat , lng 서치파라미터 값을 포함한 경우 경우 boundsParams 의 경계값을 벗어나지 않는지 확인합니다.
    if (
      lat &&
      lng &&
      lat > southWestLat &&
      lat < northEastLat &&
      lng > southWestLng &&
      lng < northEastLng
    ) {
      return;
    }

    // lat , lng 가 유효하지 않은 경우 boundsParams 의 중심값을 사용합니다.
    setPlaceQueryParams({
      lat: (northEastLat + southWestLat) / 2,
      lng: (northEastLng + southWestLng) / 2,
    });
  }, [pathname, boundsParams]);

  return {
    placeParams: { lat, lng },
    setPlaceQueryParams,
    boundsAdjacentPlace,
  };
};
