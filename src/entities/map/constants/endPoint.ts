import { API_BASE_URL } from "@/shared/constants";
import type { LatLng } from "../types/client";

export const REGION_END_POINT = {
  CURRENT_POSITION: ({ lat, lng }: NonNullableObject<LatLng>) =>
    `${API_BASE_URL}/addresses/search-by-location?lat=${lat}&lng=${lng}`,
  REGION_LIST: (keyword: string) =>
    `${API_BASE_URL}/addresses?keyword=${keyword}`,
};
