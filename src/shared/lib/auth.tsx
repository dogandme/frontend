import { type ComponentType } from "react";
import { AUTH_ERROR_MESSAGE } from "../constants";
import { type ROLE, useAuthStore } from "../store";

const getAuthErrorMessage = (role: ROLE) => {
  switch (role) {
    case null:
      return AUTH_ERROR_MESSAGE.NON_LOGIN;
    case "ROLE_NONE":
      return AUTH_ERROR_MESSAGE.NON_USER_INFO;
    case "ROLE_GUEST":
      return AUTH_ERROR_MESSAGE.NON_PET_INFO;
    default:
      return AUTH_ERROR_MESSAGE.NON_AUTHORIZED;
  }
};

export const withAuth = <P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  role: ROLE[],
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
    const maxLevel = Math.max(
      ...role.map((key) => {
        if (key === null) return roleLevels.null;
        return roleLevels[key];
      }),
    );

    if (currentLevel < maxLevel) {
      throw new Error(getAuthErrorMessage(userRole));
    }

    throw new Error(AUTH_ERROR_MESSAGE.NON_AUTHORIZED);
  };
};
