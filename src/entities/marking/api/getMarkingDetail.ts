import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT, markingQueryKey } from "../constants";
import type { Marking } from "./getMarkingList";

export interface GetMarkingDetailRequest {
  markingId?: number;
}

export const useGetMarkingDetail = ({ markingId }: GetMarkingDetailRequest) => {
  const { token } = useAuthStore.getState();

  return useQuery({
    queryKey: markingQueryKey.detail(markingId as number),
    queryFn:
      token && markingId !== undefined
        ? () =>
            apiClient.get<Marking>(MARKING_END_POINT.DETAIL({ markingId }), {
              withToken: true,
            })
        : skipToken,
  });
};
