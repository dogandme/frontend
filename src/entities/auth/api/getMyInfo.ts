import { skipToken, useQuery } from "@tanstack/react-query";
import type { Region } from "@/features/auth/api/region";
import { AuthStore } from "@/shared/store";
import { MY_INFO_END_POINT, SOCIAL_TYPE } from "../constants";

export interface MyInfo {
  email: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: "10" | "20" | "30" | "40" | "50" | "60";
  regions: Region[];
  nickLastModDt: string | null;
  socialType: keyof typeof SOCIAL_TYPE;
  isPasswordSet: boolean;
}

export interface MyInfoResponse {
  code: number;
  message: string;
  content: MyInfo;
}

const getMyInfo = async ({ token }: { token: string }) => {
  const response = await fetch(MY_INFO_END_POINT, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const data: MyInfoResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const useGetMyInfo = ({ token }: Pick<AuthStore, "token">) => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: typeof token === "string" ? () => getMyInfo({ token }) : skipToken,
    select: (data) => data.content,
  });
};
