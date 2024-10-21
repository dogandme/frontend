export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `/maps/reverse-geocode?lat=${lat}&lng=${lng}`;
