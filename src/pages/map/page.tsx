import { LocalMarkingListBottomSheet } from "@/widgets/map/ui";
import { useMapQueryParams } from "@/features/map/lib";
import { MarkingPins } from "@/entities/map/ui";
import { useGetBoundaryMarkerList } from "@/entities/marking/api";

const MapPage = () => {
  const { boundsParams } = useMapQueryParams();
  const { data } = useGetBoundaryMarkerList({
    ...boundsParams,
  });

  return (
    <>
      {data && <MarkingPins tiles={data} />}
      <LocalMarkingListBottomSheet />
    </>
  );
};

export default MapPage;
