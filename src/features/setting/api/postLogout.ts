import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthStore, useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

/**
 * @param token - useAuthStore 에 담긴 토큰 값 입니다.
 * @returns - 로그아웃 요청에 대한 응답을 반환합니다.
 */
const postLogout = async (token: NonNullable<AuthStore["token"]>) => {
  const response = await fetch(SETTING_END_POINT.LOGOUT, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * 해당 훅은 token 을 인수로 받는 postLogout 을 반환합니다.
 * 요청이 성공하게 되면 다음과 같은 작업이 기본적으로 일어납니다.
 * 1. useAuthStore 상태 초기화
 * 2. queryClient 에서 해당 nickname 을 가진 쿼리를 제거
 * 3. 인수로 받은 onMutate 함수 실행
 */
export const usePostLogout = ({ onMutate }: { onMutate: () => void }) => {
  const queryClient = useQueryClient();
  const resetAuthStore = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: postLogout,
    // 2024/10/03 - 현재는 로그아웃 단계에서 response 값과 상관 없이 로그아웃 처리 하기로 이야기 나눠놓았습니다.
    onMutate: () => {
      const { nickname } = useAuthStore.getState();
      queryClient.removeQueries({ queryKey: ["profile", nickname] });

      resetAuthStore();

      onMutate();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
