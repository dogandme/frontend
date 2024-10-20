import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REVERSE_GEOCODING_END_POINT } from "../constants";

interface GetAddressFromLatLngRequestData {
  lat: number;
  lng: number;
}

interface GetAddressFromLatLngResponseData {
  region: string;
}

const getAddressFromLatLng = async ({
  lat,
  lng,
}: GetAddressFromLatLngRequestData) => {
  return apiClient.get<GetAddressFromLatLngResponseData>(
    REVERSE_GEOCODING_END_POINT({ lat, lng }),
    {
      withToken: true,
    },
  );
};

export const useGetAddressFromLatLng = ({
  lat,
  lng,
}: GetAddressFromLatLngRequestData) => {
  return useQuery({
    queryKey: ["address", lat, lng],
    queryFn: () => getAddressFromLatLng({ lat, lng }),
  });
};
