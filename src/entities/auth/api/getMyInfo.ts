import { skipToken, useQuery } from "@tanstack/react-query";
import { MY_INFO_END_POINT } from "../constants";

interface Region {
  id: number;
  province: string;
  cityCounty: string | null;
  district: string | null;
  subDistrict: string;
}

interface UserInfo {
  email: string;
  gender: "MALE" | "FEMALE";
  age: 10 | 20 | 30 | 40 | 50 | 60;
  regions: Region[];
  nickLastModDt: string | null;
  socialType: "NAVER" | "GOOGLE" | "EMAIL";
  isPasswordSet: boolean;
}

interface UserInfoResponse {
  code: number;
  message: string;
  content: UserInfo;
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

  return response.json();
};

export const useGetMyInfo = ({ token }: { token?: string }) => {
  return useQuery<UserInfoResponse, Error>({
    queryKey: ["myInfo"],
    queryFn: token ? () => getMyInfo({ token }) : skipToken,
  });
};
