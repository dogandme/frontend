import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortType } from "@/entities/marking/api";
import { sortTypeMap } from "../constants";
import type { Bounds } from "./useGetMapCurrentBounds";

export interface Filter {
  sortType?: SortType;
  bounds?: Bounds;
}

export const getNumberParam = (
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

export const useMapQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const northEastLat = getNumberParam("boundsNELat", searchParams);
  const northEastLng = getNumberParam("boundsNELng", searchParams);
  const southWestLat = getNumberParam("boundsSWLat", searchParams);
  const southWestLng = getNumberParam("boundsSWLng", searchParams);

  const bounds: Bounds = useMemo(
    () => ({
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng,
    }),
    [northEastLat, northEastLng, southWestLat, southWestLng],
  );

  const hasBoundsParams = Object.values(bounds).every(
    (value) => value !== null,
  );

  const sortTypeParam = searchParams.get("sortType");
  const hasSortTypeParam = !!sortTypeParam && sortTypeParam in sortTypeMap;
  const sortType = hasSortTypeParam ? (sortTypeParam as SortType) : null;

  const setMapQueryParams = ({ bounds, sortType }: Filter) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const { northEastLat, northEastLng, southWestLat, southWestLng } =
      bounds || {};
    const hasNewBoundsParams =
      northEastLat && northEastLng && southWestLat && southWestLng;

    if (hasNewBoundsParams) {
      newSearchParams.set("boundsNELat", northEastLat.toString());
      newSearchParams.set("boundsNELng", northEastLng.toString());
      newSearchParams.set("boundsSWLat", southWestLat.toString());
      newSearchParams.set("boundsSWLng", southWestLng.toString());
    }

    if (sortType) {
      newSearchParams.set("sortType", sortType);
    }

    setSearchParams(newSearchParams);
  };

  return {
    boundsParams: bounds,
    hasBoundsParams,
    sortTypeParam: sortType,
    hasSortTypeParam,
    setMapQueryParams,
  };
};
