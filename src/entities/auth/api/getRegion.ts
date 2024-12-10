import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REGION_END_POINT } from "../constants";
import { authQueryKey } from "../constants";

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

type GetRegionByKeywordResponse = Region[];

const getRegionByKeyword = async (keyword: string) => {
  return apiClient.get<GetRegionByKeywordResponse>(
    REGION_END_POINT.REGION_LIST(keyword),
  );
};

export const useGetRegionByKeyword = ({
  keyword,
  enabled = false,
}: {
  keyword: RegionKeyword;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: authQueryKey.regionKeyword(keyword),
    queryFn: () => getRegionByKeyword(keyword),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

type GetRegionByLatLngRequest = LatLng;
type GetRegionByLatLngResponse = Region[];

const getRegionByLatLng = async ({ lat, lng }: GetRegionByLatLngRequest) => {
  return apiClient.get<GetRegionByLatLngResponse>(
    REGION_END_POINT.CURRENT_POSITION({ lat, lng }),
  );
};

export const useGetRegionByLatLng = ({
  lat,
  lng,
  enabled = false,
}: LatLng & { enabled: boolean }) => {
  return useQuery({
    queryKey: authQueryKey.regionLatLng({ lat, lng }),
    queryFn: () => getRegionByLatLng({ lat, lng }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
