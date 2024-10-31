import { useNavigate } from "react-router-dom";
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
  const setIsLastSearchedLocation = useMapStore(
    (state) => state.setIsLastSearchedLocation,
  );

  const { bounds, sortType, setMapParams } = useMapParams();
  const getCurrentBounds = useGetMapCurrentBounds();

  const viewMode = getViewMode();
  const defaultSortType =
    viewMode === "MAP" || viewMode === "PLACE" ? "POPULARITY" : "RECENT";

  // 맵의 bounds로 파라미터를 설정합니다.
  const searchByMapBounds = (newSortType?: SortType) => {
    const currentBounds = getCurrentBounds();

    setMapParams({
      bounds: currentBounds,
      sortType: newSortType || sortType || defaultSortType,
    });

    setTimeout(() => {
      setIsLastSearchedLocation(true);
    }, 0);
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
  };

  const navigate = useNavigate();

  // 동네 마킹 바텀 시트를 열었을 때, 현재 bounds로 파라미터를 설정합니다.
  // 동네 마킹 데이터는 맵의 bounds로 불러옵니다.
  // 내 위치 중심: 사용자 위치로 맵이 이동한 후, bounds로 데이터를 불러옵니다.
  // 현재 지도 중심: 현재 지도의 bounds로 데이터를 불러옵니다.
  const searchLocal = (newSortType?: Filter["sortType"]) => {
    navigate(ROUTER_PATH.MAP);
    searchByMapBounds(newSortType);
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
  };

  return {
    searchByMapBounds,
    searchBySortType,
    searchLocal,
    searchPlace,
  };
};
