import { LocalMarkingList } from "@/widgets/map/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { useMapStore } from "@/features/map/store";
import { Pin, MultiplePin } from "@/entities/map/ui";
import { useKMeansClustering } from "@/entities/map/ui/lib";
import { useGetBoundaryMarkerList } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";

export const MapPage = () => {
  const zoom = useMapStore((state) => state.zoom);
  const { boundsParams } = useMapQueryParams();
  const { data: markerList } = useGetBoundaryMarkerList({
    ...boundsParams,
  });
  console.log(zoom);
  const [clusteredMarker, singleMarker] = useKMeansClustering(10, markerList);

  return (
    <>
      {clusteredMarker?.map(({ center, markers }) => (
        <MultiplePin
          position={center}
          imageUrl={markers[0].previewImage}
          alt={markers[0].markingId.toString()}
          markerCount={markers.length}
        />
      ))}
      {singleMarker?.map(({ markingId, lat, lng, previewImage }) => (
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
