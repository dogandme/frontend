import { skipToken, useQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { LatLng } from "@/entities/map/@x/marking";
import { apiClient } from "@/shared/lib";
import { REVERSE_GEOCODING_END_POINT } from "../constants";
import { markingQueryKey } from "./queryKey";

type UseGetAddressFromLatLngParams = LatLng;
type GetAddressFromLatLngRequest =
  NonNullableObject<UseGetAddressFromLatLngParams>;

interface GetAddressFromLatLngResponse {
  region: string;
}

const getAddressFromLatLng = async ({
  lat,
  lng,
}: GetAddressFromLatLngRequest) => {
  return apiClient.get<GetAddressFromLatLngResponse>(
    REVERSE_GEOCODING_END_POINT({ lat, lng }),
    {
      withToken: true,
    },
  );
};

export const useGetAddressFromLatLng = ({
  lat,
  lng,
}: UseGetAddressFromLatLngParams) => {
  const { isIdle } = useMapStore.getState();

  return useQuery({
    queryKey: markingQueryKey.address({ lat: lat!, lng: lng! }),
    queryFn:
      isIdle && typeof lat === "number" && typeof lng === "number"
        ? () => getAddressFromLatLng({ lat, lng })
        : skipToken,
  });
};
