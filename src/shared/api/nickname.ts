import { useMutation } from "@tanstack/react-query";
import { NICKNAME_END_POINT } from "../constants";

export interface DuplicateNicknameRequestData {
  nickname: string;
}

export interface DuplicateNicknameResponse {
  code: number;
  message: string;
}

const postDuplicateNickname = async ({
  nickname,
}: DuplicateNicknameRequestData) => {
  const response = await fetch(NICKNAME_END_POINT.DUPLICATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname }),
  });

  const data: DuplicateNicknameResponse = await response.json();

  // 409: 중복된 닉네임
  if (!response.ok) {
    const { message } = data;

    throw new Error(message);
  }

  return data;
};

export const usePostDuplicateNickname = () => {
  return useMutation<
    DuplicateNicknameResponse,
    Error,
    DuplicateNicknameRequestData
  >({
    mutationFn: postDuplicateNickname,
    mutationKey: ["checkDuplicateNickname"],
  });
};
