import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTER_PATH } from "@/shared/constants";
import { useMapStore } from "../store";
import { useGetMapCurrentBounds } from "./useGetMapCurrentBounds";
import { type Filter, useMapParams } from "./useMapParams";

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

  // 현재 맵의 bounds로 파라미터를 설정합니다.
  const searchByCurrentBounds = (newSortType?: Filter["sortType"]) => {
    const currentBounds = getCurrentBounds();

    setMapParams({
      bounds: currentBounds,
      sortType: newSortType || sortType || "POPULARITY",
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
    searchLocal,
    searchPlace,
  };
};
