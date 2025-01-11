import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markingQueryKey } from "@/entities/marking/api";
import type { Marking } from "@/entities/marking/types/server";
import { profileQueryKey } from "@/entities/profile/api";
import type { ProfileInfo } from "@/entities/profile/types/server";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

interface PostSaveMarkingRequest {
  markingId: Marking["markingId"];
}

const postSaveMarking = async ({ markingId }: PostSaveMarkingRequest) => {
  return apiClient.post(MARKING_END_POINT.SAVE(markingId), {
    withToken: true,
  });
};

export const usePostSaveMarking = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PostSaveMarkingRequest>({
    mutationFn: postSaveMarking,
    onSuccess: (_data, { markingId }) => {
      const myProfile = queryClient.getQueryData<ProfileInfo>(
        profileQueryKey.myProfile(),
      );
      queryClient.setQueryData(profileQueryKey.myProfile(), {
        ...myProfile,
        bookmarks: myProfile?.bookmarks
          ? [...myProfile.bookmarks, markingId]
          : [markingId],
      });

      [profileQueryKey.myProfile(), markingQueryKey.markingListAll()].forEach(
        (queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        },
      );
    },
  });
};
