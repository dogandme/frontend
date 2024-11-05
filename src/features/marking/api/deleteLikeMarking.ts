import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMapMode } from "@/features/map/hooks";
import type { GetMyLikedMarkingListResponse } from "@/entities/marking/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteLikeMarkingRequest {
  markingId: number;
}

const deleteLikeMarking = async ({ markingId }: DeleteLikeMarkingRequest) => {
  return apiClient.delete(MARKING_END_POINT.LIKE(markingId), {
    withToken: true,
  });
};

export const useDeleteLikeMarking = () => {
  const queryClient = useQueryClient();
  const mode = useMapMode();

  return useMutation<unknown, Error, DeleteLikeMarkingRequest>({
    mutationFn: deleteLikeMarking,
    onSuccess: (_, { markingId }) => {
      if (mode === "MY_ACTIVITY") {
        queryClient.setQueryData<InfiniteData<GetMyLikedMarkingListResponse>>(
          ["myLikedMarkingList"],
          (oldData) => {
            if (!oldData) return oldData;

            const { pages } = oldData;
            const newPages = pages.map((page) => ({
              ...page,
              markings: page.markings.filter(
                (marking) => marking.markingId !== markingId,
              ),
            }));

            return {
              ...oldData,
              pages: newPages,
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["myLikedMarkingList"],
        });
      }
    },
  });
};
