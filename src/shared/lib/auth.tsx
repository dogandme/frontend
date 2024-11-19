import { type ComponentType } from "react";
import { AUTH_ERROR_MESSAGE } from "../constants";
import { useAuthStore } from "../store";

export const withAuth = <P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  role: (null | "ROLE_NONE" | "ROLE_GUEST" | "ROLE_USER")[],
) => {
  return (props: P) => {
    const userRole = useAuthStore((state) => state.role);

    if (role.includes(userRole)) {
      return <Component {...props} />;
    }

    const roleLevels = {
      null: 0,
      ROLE_NONE: 1,
      ROLE_GUEST: 2,
      ROLE_USER: 3,
    };

    const currentLevel = roleLevels[userRole === null ? "null" : userRole];
    const maxLevel = role.reduce((max, cur) => {
      return Math.max(max, roleLevels[cur === null ? "null" : cur]);
    }, 0);

    if (userRole === null && currentLevel <= maxLevel) {
      throw new Error(AUTH_ERROR_MESSAGE.NON_LOGIN);
    }

    if (userRole === "ROLE_NONE" && currentLevel <= maxLevel) {
      throw new Error(AUTH_ERROR_MESSAGE.NON_USER_INFO);
    }

    if (userRole === "ROLE_GUEST" && currentLevel <= maxLevel) {
      throw new Error(AUTH_ERROR_MESSAGE.NON_PET_INFO);
    }

    throw new Error(AUTH_ERROR_MESSAGE.NON_AUTHORIZED);
  };
};
