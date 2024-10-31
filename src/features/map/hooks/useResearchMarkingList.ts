import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { SortType } from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useMapStore } from "../store";
import { useGetMapCurrentBounds } from "./useGetMapCurrentBounds";
import { type Filter, useMapParams } from "./useMapParams";

const getViewMode = () => {
  const { pathname } = window.location;

  switch (pathname) {
    case ROUTER_PATH.MAP:
      return "MAP";
    case ROUTER_PATH.PLACE:
      return "PLACE";
    default:
      return "";
  }
};

export const useResearchMarkingList = () => {
  const queryClient = useQueryClient();

  const setIsLastSearchedLocation = useMapStore(
    (state) => state.setIsLastSearchedLocation,
  );

  const removeCacheMarkData = () => {
    queryClient.removeQueries({
      queryKey: ["markingList"],
    });
    queryClient.removeQueries({
      queryKey: ["boundaryMarkerList"],
    });
  };

  const { bounds, sortType, hasBoundsParams, hasSortTypeParam, setMapParams } =
    useMapParams();
  const getCurrentBounds = useGetMapCurrentBounds();

  const viewMode = getViewMode();
  const defaultSortType =
    viewMode === "MAP" || viewMode === "PLACE" ? "POPULARITY" : "RECENT";

  // 현재 맵의 bounds로 파라미터를 설정합니다.
  const searchByCurrentBounds = (newSortType?: SortType) => {
    const currentBounds = getCurrentBounds();

    setMapParams({
      bounds: currentBounds,
      sortType: newSortType || sortType || defaultSortType,
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    removeCacheMarkData();
  };

  // sortType 파라미터를 변경
  const searchBySortType = (newSortType: SortType) => {
    setMapParams({
      bounds,
      sortType: newSortType,
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    removeCacheMarkData();
  };

  const navigate = useNavigate();

  // 동네 마킹 바텀 시트를 열었을 때, 현재 bounds로 파라미터를 설정합니다.
  const searchLocal = (newSortType?: Filter["sortType"]) => {
    navigate(ROUTER_PATH.MAP);
    searchByCurrentBounds(newSortType);
  };

  // 이 장소 관련 마킹 마텀 시트를 열었을 때, bounds와 sortType로 파라미터를 설정합니다.
  const searchPlace = (filter: Filter) => {
    navigate(ROUTER_PATH.PLACE);

    setMapParams({
      bounds: filter.bounds || bounds,
      sortType: filter.sortType || "POPULARITY",
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);

    removeCacheMarkData();
  };

  return {
    bounds,
    sortType,
    hasBoundsParams,
    hasSortTypeParam,
    searchByCurrentBounds,
    searchBySortType,
    searchLocal,
    searchPlace,
  };
};
