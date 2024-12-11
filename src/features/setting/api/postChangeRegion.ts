import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKey } from "@/entities/auth/constants";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

export interface PostChangeRegionRequest {
  newIds: number[];
}

const postChangeRegion = async (changeRegionData: PostChangeRegionRequest) => {
  return apiClient.post(SETTING_END_POINT.CHANGE_REGION, {
    withToken: true,
    body: changeRegionData,
  });
};

export const usePostChangeRegion = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PostChangeRegionRequest>({
    mutationFn: postChangeRegion,
    mutationKey: ["postChangeRegion"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authQueryKey.myInfo(),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
