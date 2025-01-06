import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { SIGN_UP_END_POINT } from "../constants";
import type { SignUpResponse } from "../types/server";

interface PostAddUserInfoRequest {
  nickname: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: 10 | 20 | 30 | 40 | 50 | 60;
  region: number[];
  marketingYn: boolean;
}

type PutAddUserInfoResponse = SignUpResponse<"ROLE_GUEST">;

const putAddUserInfo = async (userInfo: PostAddUserInfoRequest) => {
  return apiClient.put<PutAddUserInfoResponse>(SIGN_UP_END_POINT.USER_INFO, {
    withToken: true,
    credentials: "include",
    body: userInfo,
  });
};

export const usePutAddUserInfo = () => {
  return useMutation<PutAddUserInfoResponse, Error, PostAddUserInfoRequest>({
    mutationFn: putAddUserInfo,
    onError: (error) => {
      console.error(error);
    },
    gcTime: 0,
  });
};
