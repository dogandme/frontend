import { skipToken, useQuery } from "@tanstack/react-query";
import { useKMeansClustering } from "@/entities/map/ui/lib";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKER_END_POINT } from "../constants";

interface Marker {
  markingId: number;
  previewImage: string;
  lat: number;
  lng: number;
}

type GetMyMarkerListResponse = Marker[];

export const useGetMyMakerList = () => {
  const { token } = useAuthStore.getState();
  const getClusteredMarkers = useKMeansClustering();

  return useQuery({
    queryKey: ["myMarkerList"],
    queryFn: token
      ? () => {
          return apiClient.get<GetMyMarkerListResponse>(MARKER_END_POINT.MY, {
            withToken: true,
          });
        }
      : skipToken,
    select: (data) => getClusteredMarkers(data),
  });
};
