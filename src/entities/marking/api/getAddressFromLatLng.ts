import { skipToken, useQuery } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { apiClient } from "@/shared/lib";
import { REVERSE_GEOCODING_END_POINT } from "../constants";
import { markingQueryKey } from "../constants";

interface GetAddressFromLatLngRequest {
  lat: number;
  lng: number;
}

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
}: {
  lat: number | null;
  lng: number | null;
}) => {
  const { isIdle } = useMapStore.getState();

  return useQuery({
    queryKey: markingQueryKey.address({ lat: lat!, lng: lng! }),
    queryFn:
      isIdle && typeof lat === "number" && typeof lng === "number"
        ? () => getAddressFromLatLng({ lat, lng })
        : skipToken,
  });
};
