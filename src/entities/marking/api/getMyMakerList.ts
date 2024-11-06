import { skipToken, useQuery } from "@tanstack/react-query";
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

  return useQuery({
    queryKey: ["marker", "myMarkerList"],
    queryFn: token
      ? () => {
          return apiClient.get<GetMyMarkerListResponse>(MARKER_END_POINT.MY, {
            withToken: true,
          });
        }
      : skipToken,
  });
};
