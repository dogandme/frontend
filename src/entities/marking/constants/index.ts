import { API_BASE_URL } from "@/shared/constants";
import { GetMarkingListRequest } from "../api";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;

export const SEARCH_MARKING_END_POINT = ({
  southWestLat,
  southWestLng,
  northEastLat,
  northEastLng,
  lat,
  lng,
  sortType,
  offset,
}: GetMarkingListRequest) =>
  `${API_BASE_URL}/markings/search?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&lat=${lat}&lng=${lng}&sortType=${sortType}&offset=${offset}`;
