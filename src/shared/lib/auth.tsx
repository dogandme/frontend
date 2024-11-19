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

    if (userRole === null) {
      throw new Error(AUTH_ERROR_MESSAGE.NON_LOGIN);
    }

    if (userRole === "ROLE_NONE") {
      throw new Error(AUTH_ERROR_MESSAGE.NON_USER_INFO);
    }

    if (userRole === "ROLE_GUEST") {
      throw new Error(AUTH_ERROR_MESSAGE.NON_PET_INFO);
    }

    return <Component {...props} />;
  };
};
