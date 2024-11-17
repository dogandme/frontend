import { useLocation } from "react-router-dom";
import { ResetIcon } from "@/shared/ui/icon";
import { useGetMapCurrentBounds, useMapQueryParams } from "../hooks";
import { useMapStore } from "../store";

export const MarkingResearchButton = () => {
  const { pathname } = useLocation();
  const { bounds } = useMapStore((state) => state.mapInfo);
  const { boundsParams, setMapQueryParams, sortTypeParam, hasBoundsParams } =
    useMapQueryParams();
  const getMapBounds = useGetMapCurrentBounds();

  const isMapInsideBoundsParams =
    hasBoundsParams &&
    bounds.east <= boundsParams.northEastLng! &&
    bounds.west >= boundsParams.southWestLng! &&
    bounds.north <= boundsParams.northEastLat! &&
    bounds.south >= boundsParams.southWestLat!;

  if (pathname !== "/map" || isMapInsideBoundsParams) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
      <button
        className="flex text-tangerine-500 gap-2 pl-2 pr-3 h-8 items-center rounded-2xl bg-grey-0 shadow-custom-1"
        onClick={() => {
          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: sortTypeParam!,
          });
        }}
      >
        <ResetIcon width={20} height={20} />
        <span className="text-grey-500 btn-3 text-center">
          현 지도에서 재검색
        </span>
      </button>
    </div>
  );
};
