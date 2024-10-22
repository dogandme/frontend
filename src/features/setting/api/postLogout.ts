import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

const postLogout = async () => {
  return apiClient.post(SETTING_END_POINT.LOGOUT, {
    withToken: true,
    credentials:
      process.env.NODE_ENV === "development" ? "include" : "same-origin",
  });
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

  return useMutation<unknown, Error>({
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
