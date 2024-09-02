import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout, MainPage } from "../pages";
import { LoginPage, LoginLayout } from "@/pages/login";
import { ROUTER_PATH } from "@/shared/constants";
import { SignUpPage } from "@/pages/sign-up";
import { EmailLoginPage } from "@/pages/login/email";
import PetInfoPage from "@/pages/sign-up/pet-info/page";
import { UserInfoRegistrationPage } from "@/pages/sign-up/user-info";
import { HistoryTracker } from "./HistoryTracker";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
  {
    path: ROUTER_PATH.LOGIN,
    element: <LoginLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: ROUTER_PATH.LOGIN_BY_EMAIL,
        element: <EmailLoginPage />,
      },
      {
        path: ROUTER_PATH.FORGET_PASSWORD,
        element: <div>forgot-password</div>,
      },
    ],
  },
  {
    path: ROUTER_PATH.SIGN_UP,
    element: (
      <>
        <HistoryTracker />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <SignUpPage />,
      },
      {
        path: ROUTER_PATH.SIGN_UP_USER_INFO,
        element: <UserInfoRegistrationPage />,
      },
      {
        path: ROUTER_PATH.SIGN_UP_PET_INFO,
        element: <PetInfoPage />,
      },
    ],
  },
]);
