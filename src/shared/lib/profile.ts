import { useParams } from "react-router-dom";
import { useAuthStore } from "../store";

/**
 * params에서 사용자의 nickname을 가져옵니다.
 * 경로에서 사용자 닉네임 옆엔 @가 붙어있으므로 slice(1)을 사용하여 @를 제거합니다.
 * @returns {nicknameParams: string, isMyPage: boolean}
 */
export const useNicknameParams = () => {
  const { nickname } = useParams<{ nickname: string }>();

  if (!nickname) {
    throw new Error("parameter에 nickname이 없습니다.");
  }

  const nicknameParams = nickname.slice(1);

  const isMyPage =
    nicknameParams === String(useAuthStore.getState().role) ||
    nicknameParams === useAuthStore.getState().nickname;

  return { nicknameParams, isMyPage };
};
