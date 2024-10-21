import { NavLink, NavLinkProps } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";

export const FollowNavigationBar = () => {
  return (
    <div className="flex self-stretch items-center title-2 text-center">
      <FollowNavLink to={ROUTER_PATH.FOLLOWING}>팔로우</FollowNavLink>
      <FollowNavLink to="/#">팔로잉</FollowNavLink>
    </div>
  );
};

const FollowNavLink = ({ children, to }: NavLinkProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex px-4 justify-center items-center flex-1 self h-[3.625rem]  ${isActive ? "text-grey-900 border-b-2 border-tangerine-500" : "text-grey-300"}`
    }
  >
    {children}
  </NavLink>
);
