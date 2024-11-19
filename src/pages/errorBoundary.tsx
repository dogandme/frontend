import { useRouteError } from "react-router-dom";
import { AUTH_ERROR_MESSAGE } from "@/shared/constants";
import { NonLogin, NonPetInfo, NonUserInfo } from "./authError";
import { NotFound } from "./notFound";

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (
    error instanceof Error &&
    error.message === AUTH_ERROR_MESSAGE.NON_LOGIN
  ) {
    return <NonLogin />;
  }

  if (
    error instanceof Error &&
    error.message === AUTH_ERROR_MESSAGE.NON_USER_INFO
  ) {
    return <NonUserInfo />;
  }

  if (
    error instanceof Error &&
    error.message === AUTH_ERROR_MESSAGE.NON_PET_INFO
  ) {
    return <NonPetInfo />;
  }

  return <NotFound />;
};
