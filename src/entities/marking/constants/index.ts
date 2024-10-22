import { API_BASE_URL } from "@/shared/constants";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;
