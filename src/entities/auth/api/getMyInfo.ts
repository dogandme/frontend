import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MY_INFO_END_POINT } from "../constants";
import { authQueryKey } from "../constants";
import type { MyInfo } from "../types/server";

type GetMyInfoResponse = MyInfo;

const getMyInfo = async () => {
  return apiClient.get<GetMyInfoResponse>(MY_INFO_END_POINT, {
    withToken: true,
  });
};

export const useGetMyInfo = () => {
  return useQuery({
    queryKey: authQueryKey.myInfo(),
    queryFn: getMyInfo,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
