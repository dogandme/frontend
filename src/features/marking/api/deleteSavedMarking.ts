import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMapMode } from "@/features/map/lib";
import { GetMySavedMarkingListResponse } from "@/entities/marking/api";
import { markingQueryKey } from "@/entities/marking/api";
import type { Marking } from "@/entities/marking/types/server";
import { profileQueryKey } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface DeleteSavedMarkingRequest {
  markingId: Marking["markingId"];
}

export const useDeleteSavedMarking = () => {
  const queryClient = useQueryClient();
  const mode = useMapMode();

  return useMutation({
    mutationFn: ({ markingId }: DeleteSavedMarkingRequest) =>
      apiClient.delete(MARKING_END_POINT.SAVE(markingId), {
        withToken: true,
      }),
    onSuccess: (_, { markingId }) => {
      if (mode === "MY_ACTIVITY") {
        queryClient.setQueryData<InfiniteData<GetMySavedMarkingListResponse>>(
          markingQueryKey.myActivityMarkingList("SAVED"),
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
          queryKey: [
            markingQueryKey.myActivityMarkingList("SAVED"),
            markingQueryKey.myActivityMarkingList("LIKED"),
          ],
        });
      }

      queryClient.invalidateQueries({
        queryKey: profileQueryKey.myProfile(),
      });
    },
  });
};
