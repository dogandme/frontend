import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SIGN_UP_END_POINT } from "../constants";

interface PostAddUserInfoRequestData {
  token: string;
  nickname: string;
  gender: "FEMALE" | "MALE" | "NONE";
  age: 10 | 20 | 30 | 40 | 50 | 60;
  region: number[];
  marketingYn: boolean;
}

interface PostAddUserInfoResponseData {
  role: string;
  nickname: string;
  authorization: string;
}

const putAddUserInfo = async (userInfo: PostAddUserInfoRequestData) => {
  return apiClient.put<PostAddUserInfoResponseData>(
    SIGN_UP_END_POINT.USER_INFO,
    {
      withToken: true,
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin",
      body: userInfo,
    },
  );
};

export const usePutAddUserInfo = ({ onSuccess }: { onSuccess: () => void }) => {
  const setNickname = useAuthStore((state) => state.setNickname);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  return useMutation<
    PostAddUserInfoResponseData,
    Error,
    PostAddUserInfoRequestData
  >({
    mutationFn: putAddUserInfo,
    onSuccess: (data) => {
      const { role, nickname, authorization } = data;

      setRole(role);
      setNickname(nickname);
      setToken(authorization);

      onSuccess();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
