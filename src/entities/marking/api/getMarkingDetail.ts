import { skipToken, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";
import type { Marking } from "../types/server";
import { markingQueryKey } from "./queryKey";

export interface GetMarkingDetailRequest {
  markingId?: number;
}

type GetMarkingDetailResponse = Marking;

export const useGetMarkingDetail = ({ markingId }: GetMarkingDetailRequest) => {
  return useQuery({
    queryKey: markingQueryKey.detail(markingId as number),
    queryFn:
      markingId !== undefined
        ? () =>
            apiClient.get<GetMarkingDetailResponse>(
              MARKING_END_POINT.DETAIL({ markingId }),
              {
                withToken: true,
              },
            )
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
