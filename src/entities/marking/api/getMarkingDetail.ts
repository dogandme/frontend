import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import type { Marking } from "./getMarkingList";

export interface GetMarkingDetailRequest {
  markingId: string;
}

export const useGetMarkingDetail = ({ markingId }: GetMarkingDetailRequest) => {
  const { token } = useAuthStore.getState();

  return useQuery({
    queryKey: ["markingList", markingId],
    queryFn: token
      ? () =>
          apiClient.get<Marking>(
            MARKING_END_POINT.DETAIL({ markingId: Number(markingId) }),
            {
              withToken: true,
            },
          )
      : skipToken,
  });
};
