import { useSearchParams } from "react-router-dom";
import type { SortType } from "@/entities/marking/api";
import { sortTypeMap } from "../constants";
import type { Bounds } from "./useGetMapCurrentBounds";

export interface Filter {
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

export const useMapParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const bounds: Bounds = {
    northEastLat: getNumberParam("boundsNELat", searchParams),
    northEastLng: getNumberParam("boundsNELng", searchParams),
    southWestLat: getNumberParam("boundsSWLat", searchParams),
    southWestLng: getNumberParam("boundsSWLng", searchParams),
  };
  const hasBoundsParams = Object.values(bounds).every(
    (value) => value !== null,
  );

  const sortTypeParam = searchParams.get("sortType");
  const hasSortTypeParam = !!sortTypeParam && sortTypeParam in sortTypeMap;
  const sortType = hasSortTypeParam ? (sortTypeParam as SortType) : null;

  const setMapParams = (mapParams: Filter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const hasNewBoundsParams =
      mapParams.bounds &&
      Object.values(mapParams.bounds).every((value) => value !== null);

    if (hasNewBoundsParams) {
      newSearchParams.set(
        "boundsNELat",
        mapParams.bounds!.northEastLat!.toString(),
      );
      newSearchParams.set(
        "boundsNELng",
        mapParams.bounds!.northEastLng!.toString(),
      );
      newSearchParams.set(
        "boundsSWLat",
        mapParams.bounds!.southWestLat!.toString(),
      );
      newSearchParams.set(
        "boundsSWLng",
        mapParams.bounds!.southWestLng!.toString(),
      );
    }

    if (mapParams.sortType) {
      newSearchParams.set("sortType", mapParams.sortType);
    }

    setSearchParams(newSearchParams);
  };

  return {
    bounds,
    hasBoundsParams,
    sortType,
    hasSortTypeParam,
    setMapParams,
  };
};
