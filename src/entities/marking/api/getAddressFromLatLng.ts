import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REVERSE_GEOCODING_END_POINT } from "../constants";

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
}: GetAddressFromLatLngRequest) => {
  return useQuery({
    queryKey: ["address", lat, lng],
    queryFn: () => getAddressFromLatLng({ lat, lng }),
  });
};
