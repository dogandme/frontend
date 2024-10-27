import { useNicknameParams } from "@/shared/lib/profile";
import { MyProfileDashboard } from "./myProfileDashboard";
import { OtherProfileDashboard } from "./otherProfileDashboard";

/**
 * 해당 컴포넌트는 /:nickname 경로로 들어온 사용자의 프로필 페이지를 나타냅니다.
 * @:nickname: 해당 닉네임을 가진 사용자의 프로필 페이지, 만약 AuthStore에 저장된 닉네임과 같다면 마이페이지처럼 이용 가능 합니다.
 */
export const ProfilePage = () => {
  const { isMyPage } = useNicknameParams();

  if (isMyPage) {
    return <MyProfileDashboard />;
  }
  return <OtherProfileDashboard />;
};
