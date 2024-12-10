import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { REGION_END_POINT } from "../constants";
import type { Region } from "../types/server";
import { regionQueryKey } from "./queryKey";

type GetRegionByKeywordResponse = Region[];

export const useGetRegionByKeyword = ({
  keyword,
  enabled,
}: {
  keyword: string;
  enabled: boolean;
}) => {
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
