import { getRandomImg } from "./getRandomImg";

export const getMockMarkerList = () =>
  Array.from({ length: 100 }, (_, index) => ({
    markingId: index + 1,
    previewImage: getRandomImg(),
    lat: 37.123456 + Math.random() * 0.1,
    lng: 127.123456 + Math.random() * 0.1,
  }));
