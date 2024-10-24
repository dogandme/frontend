import { useParams } from "react-router-dom";
import { useAuthStore } from "../store";

/**
 * URL 경로에서 사용자의 닉네임을 가져옵니다.
 * 경로에서 사용자 닉네임 앞에 '@'가 붙어있으므로 slice(1)을 사용하여 '@'를 제거합니다.
 * 또한, 현재 사용자의 페이지인지 여부를 확인합니다.
 *
 * @returns {{ nicknameParams: string, isMyPage: boolean }}
 * - nicknameParams: URL에서 '@'를 제거한 사용자 닉네임.
 * - isMyPage: 현재 페이지가 사용자의 페이지인지 여부를 나타내는 불리언 값.
 * @throws {Error} parameter에 nickname이 없을 경우 에러를 던집니다.
 */
export const useNicknameParams = () => {
  const { nickname } = useParams<{ nickname: string }>();

  if (!nickname) {
    throw new Error("parameter에 nickname이 없습니다.");
  }

  const nicknameParams = nickname.slice(1);
  const isMyPage = nicknameParams === useAuthStore.getState().nickname;

  return { nicknameParams, isMyPage };
};
