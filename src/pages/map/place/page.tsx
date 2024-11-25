import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { mapOptions } from "@/widgets/map/constants";
import { PlaceMarkingListBottomSheet } from "@/widgets/map/ui";
import { MAP_INITIAL_ZOOM } from "@/features/map/constants";
import { useMapQueryParams } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { MarkingPins } from "@/entities/map/ui";
import { useGetBoundaryMarkerList } from "@/entities/marking/api";

export const PlaceMarkingPage = () => {
  const { boundsParams } = useMapQueryParams();
  const { data } = useGetBoundaryMarkerList({
    ...boundsParams,
  });
  const map = useMap();
  const isIdle = useMapStore((state) => state.isIdle);

  // 이 장소 마킹으로 초기 진입한 경우에는 maxZoom 으로 변경합니다.
  useEffect(() => {
    if (!map || !isIdle) return;

    const { zoom } = useMapStore.getState().mapInfo;
    if (zoom === MAP_INITIAL_ZOOM) {
      map.setZoom(mapOptions.maxZoom);
    }
  }, [map, isIdle]);

  return (
    <>
      {data && <MarkingPins tiles={data} />}
      <PlaceMarkingListBottomSheet />
    </>
  );
};
