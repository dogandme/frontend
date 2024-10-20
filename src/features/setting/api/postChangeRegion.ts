import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Region } from "@/features/auth/api/region";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

export interface PostChangeRegionRequestData {
  newIds: Region["id"][];
}

interface PutChangeRegionResponseData {
  code: number;
  message: string;
}

const postChangeRegion = async (
  changeRegionData: PostChangeRegionRequestData,
) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_REGION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
    },
    body: JSON.stringify(changeRegionData),
  });

  const data = (await response.json()) as PutChangeRegionResponseData;

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePostChangeRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
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
