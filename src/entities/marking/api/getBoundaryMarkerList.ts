import { skipToken, useQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { Bounds } from "@/entities/map/@x/marking";
import { useTiling } from "@/entities/map/lib";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKER_END_POINT } from "../constants";
import type { Marker } from "../types/server";
import { markerQueryKey } from "./queryKey";

type UseGetBoundaryMarkerListParams = Bounds;
type GetBoundaryMarkerListRequest =
  NonNullableObject<UseGetBoundaryMarkerListParams>;

type GetBoundaryMarkerListResponse = Marker[];

const getBoundaryMarkerList = async ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
}: GetBoundaryMarkerListRequest) => {
  const hasToken = !!useAuthStore.getState().token;

  return apiClient.get<GetBoundaryMarkerListResponse>(
    MARKER_END_POINT.BOUNDARY({
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    }),
    {
      withToken: hasToken,
    },
  );
};

export const useGetBoundaryMarkerList = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
}: UseGetBoundaryMarkerListParams) => {
  const { isIdle: isMapIdle } = useMapStore.getState();
  const getTiles = useTiling();

  return useQuery({
    queryKey: markerQueryKey.boundaryMarker({
      southWestLat: southWestLat!,
      southWestLng: southWestLng!,
      northEastLat: northEastLat!,
      northEastLng: northEastLng!,
    }),

    queryFn:
      isMapIdle &&
      !!southWestLat &&
      !!southWestLng &&
      !!northEastLat &&
      !!northEastLng
        ? () =>
            getBoundaryMarkerList({
              southWestLat,
              southWestLng,
              northEastLat,
              northEastLng,
            })
        : skipToken,

    refetchOnWindowFocus: false,
    select: (data) => {
      return getTiles(data, {
        southWestLat: southWestLat!,
        southWestLng: southWestLng!,
        northEastLat: northEastLat!,
        northEastLng: northEastLng!,
      });
    },
    staleTime: 1000 * 60 * 1,
  });
};
