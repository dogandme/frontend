import { createBrowserRouter } from "react-router-dom";
import { LoginPage, LoginLayout } from "@/pages/login";
import { EmailLoginPage } from "@/pages/login/email";
import { MapPage } from "@/pages/map";
import { MyPage } from "@/pages/my-page";
import { SettingPage } from "@/pages/my-page/setting";
import { AccountManagementPage } from "@/pages/my-page/setting/manage-account";
import { SignUpPage } from "@/pages/sign-up";
import PetInfoPage from "@/pages/sign-up/pet-info/page";
import { UserInfoRegistrationPage } from "@/pages/sign-up/user-info";
import { ROUTER_PATH } from "@/shared/constants";
import { MainLayout, MainPage } from "../pages";
import { GoogleMapsProvider } from "./GoogleMapsProvider";

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
        element: (
          <GoogleMapsProvider>
            <MapPage />
          </GoogleMapsProvider>
        ), // 지도
      },
      {
        path: ROUTER_PATH.MY_PAGE,
        children: [
          {
            index: true,
            element: <MyPage />,
          },
          {
            path: ROUTER_PATH.SETTING,
            children: [
              {
                index: true,
                element: <SettingPage />,
              },
              {
                path: ROUTER_PATH.MANAGE_ACCOUNT,
                element: <AccountManagementPage />,
              },
            ],
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
        ],
      },
      {
        path: ROUTER_PATH.SIGN_UP,
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
    ],
  },
]);
