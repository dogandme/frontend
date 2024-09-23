import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationbar";

interface ProfileNavigationBarProps {
  role: string | null;
  nickname: string | null;
}

export const ProfileNavigationBar = ({
  role,
  nickname,
}: ProfileNavigationBarProps) => {
  return (
    <NavigationBar
      componentType="buttonRight"
      label={
        role === null ? (
          <Link to={ROUTER_PATH.LOGIN} className="text-grey-900 title-1">
            로그인 후 이용해 주세요
          </Link>
        ) : role === "ROLE_NONE" ? (
          <Link
            to={ROUTER_PATH.SIGN_UP_USER_INFO}
            className="text-grey-900 title-1"
          >
            기본 정보 입력 후 이용해 주세요
          </Link>
        ) : (
          <h1 className="text-grey-900 title-1">{nickname}님</h1>
        )
      }
      button={
        <button className="px-3 py-3 text-grey-500">
          <SettingIcon />
        </button>
      }
    />
  );
};
