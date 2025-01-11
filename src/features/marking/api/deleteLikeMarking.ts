import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMapMode } from "@/features/map/lib";
import type { GetMyLikedMarkingListResponse } from "@/entities/marking/api";
import { markingQueryKey } from "@/entities/marking/api";
import type { Marking } from "@/entities/marking/types/server";
import { profileQueryKey } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteLikeMarkingRequest {
  markingId: Marking["markingId"];
}

export const useDeleteLikeMarking = () => {
  const queryClient = useQueryClient();
  const mode = useMapMode();

  return useMutation({
    mutationFn: ({ markingId }: DeleteLikeMarkingRequest) =>
      apiClient.delete(MARKING_END_POINT.LIKE(markingId), {
        withToken: true,
      }),
    onSuccess: (_, { markingId }) => {
      if (mode === "MY_ACTIVITY") {
        queryClient.setQueryData<InfiniteData<GetMyLikedMarkingListResponse>>(
          markingQueryKey.myActivityMarkingList("LIKED"),
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
      }

      [profileQueryKey.myProfile(), markingQueryKey.markingListAll()].forEach(
        (queryKey) => {
          queryClient.invalidateQueries({
            queryKey,
          });
        },
      );
    },
  });
};
