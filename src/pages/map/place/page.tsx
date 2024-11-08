import { PlaceMarkingList } from "@/widgets/map/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { MarkingPins } from "@/entities/map/ui";
import { useGetBoundaryMarkerList } from "@/entities/marking/api";

export const PlaceMarkingPage = () => {
  const { boundsParams } = useMapQueryParams();
  const { data } = useGetBoundaryMarkerList({
    ...boundsParams,
  });

  return (
    <>
      {data && <MarkingPins {...data} />}
      <PlaceMarkingList />
    </>
  );
};
