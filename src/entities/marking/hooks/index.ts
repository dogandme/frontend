// 맵에 보여줄 마커를 반환하는 훅
import { useLocation } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useGetBoundaryMarkerList } from "../api";
import { useGetMyMakerList } from "../api/getMyMakerList";

export const useGetMarkerList = (boundsParams: {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
}) => {
  const { pathname } = useLocation();

  const isMyPage = pathname === ROUTER_PATH.MY_MARK;

  const boundaryMarkerListResult = useGetBoundaryMarkerList({
    ...boundsParams,
    enabled: !isMyPage,
  });
  const myMarkerListResult = useGetMyMakerList();

  if (isMyPage) return myMarkerListResult;

  return boundaryMarkerListResult;
};
