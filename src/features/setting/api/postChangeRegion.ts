import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Region } from "@/entities/auth/api";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

export interface PostChangeRegionRequest {
  newIds: Region["id"][];
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
        queryKey: ["myInfo"],
      });
    },
    onError: (error) => {
      // TODO 스낵바 로직 나오면 변경 하기
      console.error(error);
    },
  });
};
