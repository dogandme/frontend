import { skipToken, useQuery } from "@tanstack/react-query";
import { useTiling } from "@/entities/map/lib";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKER_END_POINT } from "../constants";
import type { Marker } from "../types/server";
import { markerQueryKey } from "./queryKey";

type GetMyMarkerListResponse = Marker[];

export const useGetMyMakerList = () => {
  const { token } = useAuthStore.getState();
  const getTiles = useTiling();

  return useQuery({
    queryKey: markerQueryKey.myMarker(),
    queryFn: token
      ? () => {
          return apiClient.get<GetMyMarkerListResponse>(MARKER_END_POINT.MY, {
            withToken: true,
          });
        }
      : skipToken,
    select: (data) => getTiles(data),
  });
};
