import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REGION_END_POINT } from "../constants";

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

type GetRegionResponse = Region[];

const getRegionByKeyword = async (keyword: RegionKeyword) => {
  return apiClient.get<GetRegionResponse>(
    REGION_END_POINT.REGION_LIST(keyword),
    {},
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
    queryKey: ["regions", keyword],
    queryFn: () => getRegionByKeyword(keyword),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

const getRegionByLatLng = async ({ lat, lng }: LatLng) => {
  return apiClient.get<GetRegionResponse>(
    REGION_END_POINT.CURRENT_POSITION({ lat, lng }),
    {},
  );
};

export const useGetRegionByLatLng = ({
  lat,
  lng,
  enabled = false,
}: LatLng & { enabled: boolean }) => {
  return useQuery({
    queryKey: ["regions", lat, lng],
    queryFn: () => getRegionByLatLng({ lat, lng }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
