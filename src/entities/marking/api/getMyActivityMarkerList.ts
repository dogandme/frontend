// TODO 타입 리팩토링 시 공통 타입으로 선언
import { skipToken, useQuery } from "@tanstack/react-query";
import { useTiling } from "@/entities/map/lib";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKER_END_POINT, markingQueryKey } from "../constants";

interface Marker {
  markingId: number;
  previewImage: string;
  lat: number;
  lng: number;
}
type GetMyActivityMarkerListRequest = "LIKED" | "SAVED";
type GetMyActivityMarkerListResponse = Marker[];

const ACTIVITY_MAP = {
  LIKED: "likes",
  SAVED: "saves",
} as const;

export const useGetMyActivityMarkerList = (
  activity: GetMyActivityMarkerListRequest,
) => {
  const getTiles = useTiling();
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: markingQueryKey.myActivityMarker(activity),
    queryFn: token
      ? () =>
          apiClient.get<GetMyActivityMarkerListResponse>(
            MARKER_END_POINT.MY_ACTIVITY(ACTIVITY_MAP[activity]),
            {
              withToken: true,
            },
          )
      : skipToken,
    staleTime: 1000 * 60 * 5,
    select: (data) => getTiles(data, activity),
  });
};
