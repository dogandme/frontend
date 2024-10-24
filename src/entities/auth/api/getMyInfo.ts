import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { MY_INFO_END_POINT, SOCIAL_TYPE } from "../constants";
import type { Region } from "./getRegion";

export interface MyInfo {
  email: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: "10" | "20" | "30" | "40" | "50" | "60";
  regions: Region[];
  nickLastModDt: string | null;
  socialType: keyof typeof SOCIAL_TYPE;
  isPasswordSet: boolean;
}

const getMyInfo = async () => {
  return apiClient.get<MyInfo>(MY_INFO_END_POINT, {
    withToken: true,
  });
};

export const useGetMyInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });
};
