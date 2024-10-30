import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  GetTemporaryMarkingListResponse,
  TempMarkingInfo,
} from "@/entities/marking/api";
import { apiClient } from "@/shared/lib";
import { MY_MARKING_ENDPOINT } from "../../follow/constants";

// TODO 타입 markingId import 하여 사용
export interface DeleteTemporaryMarkingRequest {
  id: TempMarkingInfo["markingId"];
}

export const useDeleteTemporaryMarking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteTemporaryMarkingRequest) =>
      apiClient.delete(MY_MARKING_ENDPOINT.DELETE_TEMPORARY_MARKING, {
        withToken: true,
        body: { id },
      }),
    mutationKey: ["deleteTemporaryMarking"],
    onSuccess: (_data, { id }) => {
      queryClient.setQueryData<InfiniteData<GetTemporaryMarkingListResponse>>(
        ["temporaryMarkingList"],
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
    },
  });
};
