/**
 * 해당 컴포넌트는 회원 가입 단계에서 공통적으로 사용 되는 네비게이션 바를 구현한 컴포넌트 입니다.
 * 회원가입 단계는 현재 이메일 회원가입 -> 유저 정보 입력 -> 강아지 정보 입력 -> 회원가입 완료 순으로 진행됩니다.
 * 회원 가입 단계를 진행하게 되면 유저 권한이 올라가기에 이전에 접근했던 페이지로 접근 할 수 없게 하여야 합니다.
 * 이에 회원 가입 단계에서 사용하는 네비게이션 바는 사용자가 뒤로가기 버튼을 눌렀을 때 이전 경로들 중 로그인 , 회원가입 단계가 아닌 페이지로 리다이렉션 시켜야 합니다.
 */
import { useNavigate } from "react-router-dom";
import { useRouteHistoryStore } from "@/shared/store/history";
import {
  BackwardNavigationBar,
  CloseNavigationBar,
} from "@/shared/ui/navigationbar";

interface AuthNavigationBarProps {
  type?: "backward" | "close";
}

export const AuthNavigationBar = ({
  type = "backward",
}: AuthNavigationBarProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const { lastNoneAuthRoute } = useRouteHistoryStore.getState();
    navigate(lastNoneAuthRoute);
  };

  if (type === "close") {
    return <CloseNavigationBar onClick={handleClick} />;
  }

  return <BackwardNavigationBar onClick={handleClick}></BackwardNavigationBar>;
};
