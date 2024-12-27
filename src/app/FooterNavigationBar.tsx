import { NavLink } from "react-router-dom";
import { useGetMyProfile } from "@/entities/profile/api";
import { EmptyProfileImage, ProfileImage } from "@/entities/profile/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { MapIcon } from "@/shared/ui/icon";

const footerNavigationBarStyles = {
  active: "text-tangerine-500",
  inactive: "text-grey-400",
  base: "body-3 text-center flex flex-col items-center justify-center gap-1",
};

export const FooterNavigationBar = () => {
  return (
    <footer className="relative">
      <nav className="relative z-10">
        <ul className="flex justify-between items-center gap-2 bg-grey-0 px-2 h-20">
          <li className="grow">
            <MapPageNavLink />
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
  const { data } = useGetMyProfile();

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

  const imageUrl = data?.pet?.profile;

  return (
    <NavLink
      to={getMyPagePath()}
      className={({ isActive }) => `${isActive ? active : inactive} ${base}`}
    >
      {imageUrl ? (
        <ProfileImage
          imageUrl={imageUrl}
          nickname={data.nickname}
          size="small"
          className="rounded-2xl flex-shrink-0"
        />
      ) : (
        <EmptyProfileImage size="small" className="rounded-2xl flex-shrink-0" />
      )}
      My
    </NavLink>
  );
};

const MapPageNavLink = () => {
  const { active, inactive, base } = footerNavigationBarStyles;

  const getMapPagePath = () => {
    const { pathname } = window.location;

    const mapPagePaths: string[] = [ROUTER_PATH.MAP, ROUTER_PATH.PLACE];

    if (mapPagePaths.includes(pathname)) {
      return window.location;
    }

    return ROUTER_PATH.MAP;
  };

  return (
    <NavLink
      to={getMapPagePath()}
      className={({ isActive }) => `${isActive ? active : inactive} ${base}`}
    >
      <MapIcon />
      지도
    </NavLink>
  );
};
