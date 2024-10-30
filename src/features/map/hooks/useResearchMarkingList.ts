import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { SortType } from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
import { sortTypeMap } from "../constants";
import { useMapStore } from "../store";

interface Bounds {
  northEastLat: number;
  northEastLng: number;
  southWestLat: number;
  southWestLng: number;
}

interface Filter {
  sortType?: SortType;
  bounds?: Bounds;
}

const getNumberParam = (
  key: string,
  searchParams: URLSearchParams,
): number | null => {
  const value = searchParams.get(key);

  if (value === null) {
    return null;
  }

  const paramToNumber = Number(value);
  const isNumber = !Number.isNaN(paramToNumber);

  if (isNumber) {
    return paramToNumber;
  }

  return null;
};

export const useResearchMarkingList = () => {
  const queryClient = useQueryClient();
  const map = useMap();

  const setIsLastSearchedLocation = useMapStore(
    (state) => state.setIsLastSearchedLocation,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  // 경계 좌표 파라미터
  const northEastLat = getNumberParam("boundsNELat", searchParams);
  const northEastLng = getNumberParam("boundsNELng", searchParams);
  const southWestLat = getNumberParam("boundsSWLat", searchParams);
  const southWestLng = getNumberParam("boundsSWLng", searchParams);
  const hasBoundsParams =
    northEastLat && northEastLng && southWestLat && southWestLng;

  const bounds: Bounds | null = hasBoundsParams
    ? {
        northEastLat,
        northEastLng,
        southWestLat,
        southWestLng,
      }
    : null;

  // 정렬 기준 파라미터
  const sortTypeParam = searchParams.get("sortType");
  const hasSortTypeParam =
    typeof sortTypeParam === "string" && sortTypeParam in sortTypeMap;

  const sortType: SortType = hasSortTypeParam
    ? (sortTypeParam as SortType)
    : "POPULARITY";

  const researchMarkingList = (filter?: Filter) => {
    if (!map) return;

    const mapBounds = map.getBounds();

    if (!mapBounds) return;

    const northEast = mapBounds.getNorthEast();
    const southWest = mapBounds.getSouthWest();

    const northEastLat = northEast.lat();
    const northEastLng = northEast.lng();
    const southWestLat = southWest.lat();
    const southWestLng = southWest.lng();

    setSearchParams({
      boundsNELat: northEastLat.toString(),
      boundsNELng: northEastLng.toString(),
      boundsSWLat: southWestLat.toString(),
      boundsSWLng: southWestLng.toString(),
      sortType: filter?.sortType || sortType,
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    queryClient.removeQueries({
      queryKey: ["markingList"],
    });
  };

  const navigate = useNavigate();

  const navigatePlace = (filter: Filter) => {
    const boundsParams = `boundsNELat=${filter.bounds?.northEastLat || northEastLat}&boundsNELng=${filter.bounds?.northEastLng || northEastLng}&boundsSWLat=${filter.bounds?.southWestLat || southWestLat}&boundsSWLng=${filter.bounds?.southWestLng || southWestLng}`;
    const sortTypeParam = `sortType=${filter.sortType || sortType}`;

    navigate(`${ROUTER_PATH.PLACE}?${boundsParams}&${sortTypeParam}`);

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    queryClient.removeQueries({
      queryKey: ["markingList"],
    });
    queryClient.removeQueries({
      queryKey: ["boundaryMarkerList"],
    });
  };

  return {
    bounds,
    sortType,
    researchMarkingList,
    navigatePlace,
  };
};
