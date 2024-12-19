import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/constants";
import regionListData from "../data/regionList.json";

const getRegionByKeyword = http.get(`${API_BASE_URL}/addresses`, (req) => {
  const {
    request: { url },
  } = req;

  const URLObject = new URL(url);
  const keyword = URLObject.searchParams.get("keyword");

  if (keyword === "강남구 역삼동") {
    return HttpResponse.json({
      code: 200,
      message: "good",
      content: regionListData["GANG-NAM"],
    });
  }

  if (keyword === "도봉구 도봉동") {
    return HttpResponse.json({
      code: 200,
      message: "good",
      content: regionListData["DOBONG"],
    });
  }

  return HttpResponse.json({
    code: 204, // 검색 결과 없을 시를 가정
    message: "입력하신 주소가 없습니다",
  });
});

const getRegionByLatLng = http.get(
  `${API_BASE_URL}/addresses/search-by-location`,
  () => {
    return HttpResponse.json({
      code: 200,
      message: "good",
      content: regionListData["CURRENT_LOCATION"],
    });
  },
);

export const mapHandlers = [getRegionByKeyword, getRegionByLatLng];
