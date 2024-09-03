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
        element: <MainPage />, // 탐색
      },
      {
        path: ROUTER_PATH.MAP,
        element: <div>map</div>, // 지도
      },
      {
        path: ROUTER_PATH.COMMUNITY,
        element: <div>community</div>, // 커뮤니티
      },
      {
        path: ROUTER_PATH.MY_PAGE,
        element: <div>my page</div>, // 기록
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
