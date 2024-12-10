import { API_BASE_URL } from "@/shared/constants";

export const REGION_END_POINT = {
  CURRENT_POSITION: ({ lat, lng }: { lat: number; lng: number }) =>
    `${API_BASE_URL}/addresses/search-by-location?lat=${lat}&lng=${lng}`,
  REGION_LIST: (keyword: string) =>
    `${API_BASE_URL}/addresses?keyword=${keyword}`,
};
