import { NavLink, NavLinkProps } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";

interface FollowNavigationBarProps {
  nickname: string;
}
export const FollowNavigationBar = ({ nickname }: FollowNavigationBarProps) => {
  return (
    <div className="flex self-stretch items-center title-2 text-center px-4">
      <FollowNavLink to={`/@${nickname}/${ROUTER_PATH.FOLLOWINGS}`}>
        팔로잉
      </FollowNavLink>
      <FollowNavLink to={`/@${nickname}/${ROUTER_PATH.FOLLOWERS}`}>
        팔로워
      </FollowNavLink>
    </div>
  );
};

const FollowNavLink = ({ children, to }: NavLinkProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex px-4 justify-center items-center flex-1 self h-[3.625rem]  ${isActive ? "text-grey-900 border-b-2 border-tangerine-500" : "text-grey-300"}`
    }
    replace
  >
    {children}
  </NavLink>
);
