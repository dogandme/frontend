import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationbar";

export const MyPageNavigationBar = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);

  return (
    <NavigationBar
      componentType="buttonRight"
      label={
        role === null || role === "ROLE_NONE" ? (
          <Link to={ROUTER_PATH.LOGIN} className="text-grey-900 title-1">
            로그인후 이용해 주세요
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
