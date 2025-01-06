import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REGION_END_POINT } from "../constants";
import type { Region } from "../types/server";
import { regionQueryKey } from "./queryKey";

interface UseGetRegionByKeywordParams {
  keyword: string;
  enabled: boolean;
}

type GetRegionByKeywordResponse = Region[];

export const useGetRegionByKeyword = ({
  keyword,
  enabled,
}: UseGetRegionByKeywordParams) => {
  return useQuery({
    queryKey: regionQueryKey.regionKeyword(keyword),
    queryFn: () =>
      apiClient.get<GetRegionByKeywordResponse>(
        REGION_END_POINT.REGION_LIST(keyword),
      ),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
