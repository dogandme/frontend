import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { GetTemporaryMarkingListResponse } from "@/entities/marking/api";
import { markingQueryKey } from "@/entities/marking/api";
import type { TempMarking } from "@/entities/marking/types/server";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteTemporaryMarkingRequest {
  id: TempMarking["markingId"];
}

export const useDeleteTemporaryMarking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteTemporaryMarkingRequest) =>
      apiClient.delete(MARKING_END_POINT.DELETE_TEMPORARY_MARKING, {
        withToken: true,
        body: { id },
      }),
    mutationKey: ["deleteTemporaryMarking"],
    onSuccess: (_data, { id }) => {
      queryClient.setQueryData<InfiniteData<GetTemporaryMarkingListResponse>>(
        markingQueryKey.myTemporaryMarkingList(),
        (data) => {
          if (!data) {
            return data;
          }
          const { pages } = data;
          const newPages = pages.map((page) => ({
            ...page,
            markings: page.markings.filter(
              (marking) => marking.markingId !== id,
            ),
          }));

          return {
            ...data,
            pages: newPages,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: markingQueryKey.myTemporaryMarkingList(),
      });
    },
  });
};
