import { Pin } from "@vis.gl/react-google-maps";
import { MyMarkingList } from "@/widgets/map/ui";
import { useGetMyMakerList } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";

export const MyMarkingPage = () => {
  const { data: markerList } = useGetMyMakerList();

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

      <MyMarkingList />
    </>
  );
};
