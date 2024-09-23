import { NavLink } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { CompassIcon, MapIcon } from "@/shared/ui/icon";
import { mainFooterStyles } from "./MainFooter.style";

export const MainFooter = () => {
  const { active, inactive, base } = mainFooterStyles;
  // TODO API 에서 받아온 프로필 이미지 사용하기
  const profileImage = "/default-image.png";
  const nickname = useAuthStore((state) => state.nickname);

  return (
    <footer className="relative">
      <div className="z-999 absolute -top-[2rem] w-full rounded-t-[28px] bg-grey-0 px-4 py-4"></div>
      <nav>
        <ul className="flex justify-between gap-2 bg-grey-0 px-2 pb-[34px]">
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.SEARCH}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <CompassIcon />
              발견
            </NavLink>
          </li>
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MAP}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <MapIcon />
              지도
            </NavLink>
          </li>
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MY_PAGE}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <img
                src={profileImage}
                alt={
                  nickname
                    ? `${nickname}님의 프로필 이미지`
                    : "기본 프로필 이미지"
                }
                className="w-6 h-6 rounded-2xl flex-shrink-0"
              />
              My
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
