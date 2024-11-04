// 맵에 보여줄 마커를 반환하는 훅
import { useMapMode } from "@/features/map/hooks";
import { useGetBoundaryMarkerList } from "../api";
import { useGetMyMakerList } from "../api/getMyMakerList";

export const useGetMarkerList = (boundsParams: {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
}) => {
  const mapMode = useMapMode();
  const isMyPage = mapMode === "MY_MARK";

  const boundaryMarkerListResult = useGetBoundaryMarkerList({
    ...boundsParams,
    enabled: !isMyPage,
  });
  const myMarkerListResult = useGetMyMakerList();

  if (isMyPage) return myMarkerListResult;

  return boundaryMarkerListResult;
};
