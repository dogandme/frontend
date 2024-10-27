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
  southWestLat?: number;
  southWestLng?: number;
  northEastLat?: number;
  northEastLng?: number;
}) => {
  return useQuery({
    queryKey: [
      "boundaryMarkerList",
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    ],

    queryFn:
      !!southWestLat && !!southWestLng && !!northEastLat && !!northEastLng
        ? () =>
            getBoundaryMarkerList({
              southWestLat,
              southWestLng,
              northEastLat,
              northEastLng,
            })
        : skipToken,

    refetchOnWindowFocus: false,
  });
};
