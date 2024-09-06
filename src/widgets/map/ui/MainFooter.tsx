import { NavLink } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { mainFooterStyles } from "./MainFooter.style";
import { CommunityIcon, CompassIcon, MapIcon } from "@/shared/ui/icon";
export const MainFooter = () => {
  const { active, inactive, base } = mainFooterStyles;

  return (
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
            to={ROUTER_PATH.COMMUNITY}
            className={({ isActive }) =>
              `${isActive ? active : inactive} ${base}`
            }
          >
            <CommunityIcon />
            커뮤니티
          </NavLink>
        </li>
        <li className="grow">
          <NavLink
            to={ROUTER_PATH.MY_PAGE}
            className={({ isActive }) =>
              `${isActive ? active : inactive} ${base}`
            }
          >
            <CommunityIcon />
            기록
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
