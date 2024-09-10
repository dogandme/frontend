// TODO BASEURL env 파일로 수정하기
export const LOGIN_END_POINT = {
  GOOGLE: "http://localhost:80/oauth2/authorization/google",
  NAVER: "http://localhost:80/oauth2/authorization/naver",
  EMAIL: "http://localhost:80/login",
};

export const SIGN_UP_END_POINT = {
  EMAIL: "http://localhost:80/users",
  VERIFICATION_CODE: "http://localhost:80/users/auth",
  CHECK_VERIFICATION_CODE: "http://localhost:80/users/auth/check",
  USER_INFO: "http://localhost:80/users/additional-info",
  PET_INFO: "http://localhost:80/pets",
};

export const ADDRESSES_END_POINT = {
  CURRENT_POSITION: ({ lat, lng }: { lat: number; lng: number }) =>
    `http://localhost:80/addresses/search-by-location?lat=${lat}&lng=${lng}`,
  ADDRESS: (keyword: string) =>
    `http://localhost:80/addresses?keyword=${keyword}`,
};
