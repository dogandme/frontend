import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import {
  AUTH_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
} from "@/shared/constants";
import { HttpError } from "@/shared/lib";
import { NonAuthorized, NonLogin, NonPetInfo, NonUserInfo } from "./authError";
import { NotFound } from "./notFound";
import { ServerError } from "./serverError";
import { UnknownError } from "./unknownError";

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

  if (
    error instanceof Error &&
    error.message === AUTH_ERROR_MESSAGE.NON_AUTHORIZED
  ) {
    return <NonAuthorized />;
  }

  if (
    (error instanceof Error && error.message === NOT_FOUND_ERROR_MESSAGE) ||
    isRouteErrorResponse(error)
  ) {
    return <NotFound />;
  }

  if (error instanceof HttpError && error.code >= 500) {
    return <ServerError />;
  }

  return <UnknownError />;
};
