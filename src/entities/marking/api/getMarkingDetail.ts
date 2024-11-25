import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT, markingQueryKey } from "../constants";
import type { Marking } from "./getMarkingList";

export interface GetMarkingDetailRequest {
  markingId?: number;
}

export const useGetMarkingDetail = ({ markingId }: GetMarkingDetailRequest) => {
  return useQuery({
    queryKey: markingQueryKey.detail(markingId as number),
    queryFn:
      markingId !== undefined
        ? () =>
            apiClient.get<Marking>(MARKING_END_POINT.DETAIL({ markingId }), {
              withToken: true,
            })
        : skipToken,
  });
};
