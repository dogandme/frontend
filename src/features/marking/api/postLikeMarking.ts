import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markingQueryKey } from "@/entities/marking/api";
import type { Marking } from "@/entities/marking/types/server";
import { profileQueryKey } from "@/entities/profile/api";
import type { ProfileInfo } from "@/entities/profile/types/server";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostLikeMarkingRequest {
  markingId: Marking["markingId"];
}

export const usePostLikeMarking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ markingId }: PostLikeMarkingRequest) =>
      apiClient.post(MARKING_END_POINT.LIKE(markingId), {
        withToken: true,
      }),
    onSuccess: (_data, { markingId }) => {
      const myProfile = queryClient.getQueryData<ProfileInfo>(
        profileQueryKey.myProfile(),
      );
      if (myProfile) {
        queryClient.setQueryData(profileQueryKey.myProfile(), {
          ...myProfile,
          likes: myProfile.likes ? [...myProfile.likes] : [markingId],
        });
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
