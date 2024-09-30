const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ADDRESSES_END_POINT = {
  CURRENT_POSITION: ({ lat, lng }: { lat: number; lng: number }) =>
    `${API_BASE_URL}/addresses/search-by-location?lat=${lat}&lng=${lng}`,
  ADDRESS: (keyword: string) => `${API_BASE_URL}/addresses?keyword=${keyword}`,
};

export const NICKNAME_END_POINT = {
  DUPLICATE: `${API_BASE_URL}/users/nickname`,
};
