import { skipToken, useQuery } from "@tanstack/react-query";
import { AuthStore } from "@/shared/store";
import { MY_INFO_END_POINT, SOCIAL_TYPE } from "../constants";

interface Region {
  id: number;
  province: string;
  cityCounty: string | null;
  district: string | null;
  subDistrict: string;
}

export interface MyInfo {
  email: string;
  gender: "MALE" | "FEMALE";
  age: 10 | 20 | 30 | 40 | 50 | 60;
  regions: Region[];
  nickLastModDt: string | null;
  socialType: keyof typeof SOCIAL_TYPE;
  isPasswordSet: boolean;
}

interface UserInfoResponse {
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

  const data: UserInfoResponse = await response.json();

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
