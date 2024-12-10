import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REGION_END_POINT } from "../constants";
import { LatLng } from "../types/client";
import type { Region } from "../types/server";
import { regionQueryKey } from "./queryKey";

type GetRegionByLatLngResponse = Region[];

export const useGetRegionByLatLng = ({
  lat,
  lng,
  enabled,
}: NonNullableObject<LatLng> & {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: regionQueryKey.regionLatLng({ lat, lng }),
    queryFn: () =>
      apiClient.get<GetRegionByLatLngResponse>(
        REGION_END_POINT.CURRENT_POSITION({
          lat,
          lng,
        }),
      ),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
