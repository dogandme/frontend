import { NavLink } from "react-router-dom";
import { useGetProfile } from "@/entities/profile/api";
import { API_BASE_URL, ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { CompassIcon, MapIcon } from "@/shared/ui/icon";

const footerNavigationBarStyles = {
  active: "text-tangerine-500",
  inactive: "text-grey-400",
  base: "body-3 text-center flex flex-col items-center justify-center gap-1",
};

export const FooterNavigationBar = () => {
  const { active, inactive, base } = footerNavigationBarStyles;

  return (
    <footer className="relative">
      <nav className="relative z-10">
        <ul className="flex justify-between items-center gap-2 bg-grey-0 px-2 h-20">
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MAIN}
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
            <MyPageNavLink />
          </li>
        </ul>
      </nav>
    </footer>
  );
};

const MyPageNavLink = () => {
  const role = useAuthStore((state) => state.role);
  const nickname = useAuthStore((state) => state.nickname);

  const { data } = useGetProfile({
    nickname,
  });
  const profileImageUrl = data?.pet?.profile
    ? `${API_BASE_URL}/pets/image/${data.pet.profile}`
    : "/default-image.png";

  const { active, inactive, base } = footerNavigationBarStyles;

  const getMyPagePath = () => {
    if (role === null) {
      return ROUTER_PATH.LOGIN;
    }
    if (role === "ROLE_NONE") {
      return ROUTER_PATH.SIGN_UP_USER_INFO;
    }
    return `/@${nickname}`;
  };

  return (
    <NavLink
      to={getMyPagePath()}
      className={({ isActive }) => `${isActive ? active : inactive} ${base}`}
    >
      <img
        src={profileImageUrl}
        alt={nickname ? `${nickname}님의 프로필 이미지` : "기본 프로필 이미지"}
        className="w-6 h-6 rounded-2xl flex-shrink-0"
      />
      My
    </NavLink>
  );
};
