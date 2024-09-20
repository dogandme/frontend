import { useQuery } from "@tanstack/react-query";
import { MAP_ENDPOINT } from "../constants";

interface AddressFromLatLngRequest {
  lat: number;
  lng: number;
  token: string;
}

interface AddressFromLatLngResponse {
  code: number;
  message: string;
  content: {
    region: string;
  };
}

const getAddressFromLatLng = async ({
  lat,
  lng,
  token,
}: AddressFromLatLngRequest) => {
  const response = await fetch(MAP_ENDPOINT.REVERSE_GEOCODING({ lat, lng }), {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const { message, content }: AddressFromLatLngResponse = await response.json();

  if (!response.ok) {
    throw new Error(message);
  }

  return content;
};

export const useGetAddressFromLatLng = ({
  lat,
  lng,
  token,
}: AddressFromLatLngRequest) => {
  return useQuery({
    queryKey: ["address", lat, lng],
    queryFn: () => getAddressFromLatLng({ lat, lng, token }),
  });
};
