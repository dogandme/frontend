import { API_BASE_URL } from "@/shared/constants";
import { GetMarkingListRequest, GetUserMarkingListRequest } from "../api";
import { GetBoundaryMarkerListRequest } from "../api/getBoundaryMarkerList";

export const REVERSE_GEOCODING_END_POINT = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => `${API_BASE_URL}/maps/reverse-geocode?lat=${lat}&lng=${lng}`;

export const MARKING_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
    lat,
    lng,
    sortType,
    offset,
  }: GetMarkingListRequest) =>
    `${API_BASE_URL}/markings/bounds?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}&lat=${lat}&lng=${lng}&sortType=${sortType}&offset=${offset}`,
};

export const MARKER_END_POINT = {
  BOUNDARY: ({
    southWestLat,
    southWestLng,
    northEastLat,
    northEastLng,
  }: GetBoundaryMarkerListRequest) =>
    `${API_BASE_URL}/markings/marks?southBottomLat=${southWestLat}&northTopLat=${northEastLat}&southLeftLng=${southWestLng}&northRightLng=${northEastLng}`,
};

export const MY_MARKING_END_POINT = {
  TEMPORARY: (offset: number) =>
    `${API_BASE_URL}/markings/temps?offset=${offset}`,
};
