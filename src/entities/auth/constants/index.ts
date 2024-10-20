export const MY_INFO_END_POINT = "/users/profile";

export const SOCIAL_TYPE = {
  EMAIL: "이메일",
  NAVER: "네이버",
  GOOGLE: "구글",
};

export const ADDRESSES_END_POINT = {
  CURRENT_POSITION: ({ lat, lng }: { lat: number; lng: number }) =>
    `/addresses/search-by-location?lat=${lat}&lng=${lng}`,
  ADDRESS: (keyword: string) => `/addresses?keyword=${keyword}`,
};
