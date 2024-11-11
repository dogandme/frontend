import { skipToken, useQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { useTiling } from "@/entities/map/lib";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKER_END_POINT } from "../constants";

interface Marker {
  markingId: number;
  previewImage: string;
  lat: number;
  lng: number;
}

export interface GetBoundaryMarkerListRequest {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
}

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
}: {
  southWestLat: number | null;
  southWestLng: number | null;
  northEastLat: number | null;
  northEastLng: number | null;
}) => {
  const { isIdle: isMapIdle } = useMapStore.getState();
  const getTiles = useTiling();

  return useQuery({
    queryKey: [
      "marker",
      "boundaryMarkerList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],

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

    gcTime: 0,
  });
};
