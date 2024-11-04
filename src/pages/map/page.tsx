import { LocalMarkingList } from "@/widgets/map/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { Pin } from "@/entities/map/ui";
import { useGetBoundaryMarkerList } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";

export const MapPage = () => {
  const { boundsParams } = useMapQueryParams();
  const { data: markerList } = useGetBoundaryMarkerList({
    ...boundsParams,
  });

  return (
    <>
      {markerList?.map(({ markingId, lat, lng, previewImage }) => (
        <Pin
          key={markingId}
          position={{ lat, lng }}
          imageUrl={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
          alt={`${markingId}의 이미지`}
        />
      ))}

      <LocalMarkingList />
    </>
  );
};
