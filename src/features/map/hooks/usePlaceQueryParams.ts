import { useSearchParams } from "react-router-dom";
import { getNumberParam } from "./useMapQueryParams";

export const usePlaceQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = getNumberParam("lat", searchParams);
  const lng = getNumberParam("lng", searchParams);

  const setPlaceQueryParams = ({ lat, lng }: { lat: number; lng: number }) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("lat", lat.toString());
      newSearchParams.set("lng", lng.toString());
      return newSearchParams;
    });
  };

  // lat , lng 로부터 반경 100m의 경계값을 계산합니다.
  // 100m 는 0.0009이기에 중심으로부터 0.00045씩 떨어진 값을 사용합니다.
  const boundsAdjacentPlace = {
    northEastLat: lat && lat + 0.00045,
    northEastLng: lng && lng + 0.00045,
    southWestLat: lat && lat - 0.00045,
    southWestLng: lng && lng - 0.00045,
  };

  return {
    placeParams: { lat, lng },
    setPlaceQueryParams,
    boundsAdjacentPlace,
  };
};
