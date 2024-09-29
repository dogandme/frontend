import { useQuery } from "@tanstack/react-query";
import { ADDRESSES_END_POINT } from "../constants";
import { ERROR_MESSAGE } from "../constants";

export interface LatLng {
  lat: number;
  lng: number;
}

type RegionKeyword = string;

export interface Region {
  id: number;
  province: string;
  cityCounty: string;
  district: string;
  subDistrict: string;
}

export type RegionResponse = Region[];

const getRegionByKeyword = async (
  keyword: RegionKeyword,
  token: string,
): Promise<RegionResponse> => {
  const response = await fetch(ADDRESSES_END_POINT.ADDRESS(keyword), {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  // TODO 에러 바운더리로 처리하기
  if (!response.ok) {
    throw new Error(ERROR_MESSAGE.UNKNOWN);
  }
  const data = await response.json();
  // TODO 백엔드와 데이터 처리 어떻게 할지 살펴보기
  if (data.code > 200) {
    throw new Error(data.message);
  }
  const regionList = data.content as RegionResponse;
  return regionList;
};

export const useGetRegionByKeyword = ({
  token,
  keyword,
  enabled = false,
}: {
  token: string;
  keyword: RegionKeyword;
  enabled: boolean;
}) => {
  return useQuery<RegionResponse, Error>({
    queryKey: ["regiones", keyword],
    queryFn: () => getRegionByKeyword(keyword, token),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

const getRegionByLatLng = async ({
  lat,
  lng,
  token,
}: LatLng & { token: string }): Promise<RegionResponse> => {
  const response = await fetch(
    ADDRESSES_END_POINT.CURRENT_POSITION({ lat, lng }),
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    },
  );

  // TODO 에러 바운더리로 처리하기
  if (!response.ok) {
    throw new Error(ERROR_MESSAGE.UNKNOWN);
  }
  const data = await response.json();
  // TODO 백엔드와 데이터 처리 어떻게 할지 살펴보기
  if (data.code > 200) {
    throw new Error(data.message);
  }

  const regionList = data.content as RegionResponse;
  return regionList;
};

export const useGetRegionByLatLng = ({
  lat,
  lng,
  token,
  enabled = false,
}: LatLng & { token: string; enabled: boolean }) => {
  return useQuery<RegionResponse, Error>({
    queryKey: ["regions", lat, lng],
    queryFn: () => getRegionByLatLng({ lat, lng, token }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
