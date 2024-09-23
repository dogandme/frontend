import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import type { AuthStore } from "@/shared/store";
import { SettingIcon } from "@/shared/ui/icon";
import { NavigationBar } from "@/shared/ui/navigationbar";

type ProfileNavigationBarProps = Pick<AuthStore, "role" | "nickname">;

export const ProfileNavigationBar = ({
  role,
  nickname,
}: ProfileNavigationBarProps) => {
  if (role === null) {
    return (
      <NavigationBar
        componentType="buttonRight"
        label={
          <Link to={ROUTER_PATH.LOGIN} className="text-grey-900 title-1">
            로그인 후 이용해 주세요
          </Link>
        }
        button={
          <button
            className="px-3 py-3 text-grey-500"
            aria-label="내 정보 설정하기"
          >
            <SettingIcon />
          </button>
        }
      />
    );
  }

  if (role === "ROLE_NONE") {
    return (
      <NavigationBar
        componentType="buttonRight"
        label={
          <Link
            to={ROUTER_PATH.SIGN_UP_USER_INFO}
            className="text-grey-900 title-1"
          >
            기본 정보 입력 후 이용해 주세요
          </Link>
        }
        button={
          <button
            className="px-3 py-3 text-grey-500"
            aria-label="내 정보 설정하기"
          >
            <SettingIcon />
          </button>
        }
      />
    );
  }

  return (
    <NavigationBar
      componentType="buttonRight"
      label={<h1 className="text-grey-900 title-1">{nickname}님</h1>}
      button={
        <button
          className="px-3 py-3 text-grey-500"
          aria-label="내 정보 설정하기"
        >
          <SettingIcon />
        </button>
      }
    />
  );
};
