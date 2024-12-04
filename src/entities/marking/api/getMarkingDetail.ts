import { skipToken, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT, markingQueryKey } from "../constants";
import type { Marking } from "./getMarkingList";
import { API_BASE_URL } from "@/shared/constants";

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
    select: (data) => ({
      ...data,
      images: data.images.map(({ imageUrl, ...rest }) => ({
        ...rest,
        imageUrl: `${API_BASE_URL}/markings/image/${data.markingId}/${imageUrl}`,
      })),
    }),
  });
};
