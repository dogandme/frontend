import { createBrowserRouter } from "react-router-dom";
import { ProfilePage } from "@/pages/[nickname]";
import { FollowerPage } from "@/pages/[nickname]/follower";
import { FollowingPage } from "@/pages/[nickname]/following";
import { LoginPage, LoginLayout } from "@/pages/login";
import { EmailLoginPage } from "@/pages/login/email";
import { MapPage } from "@/pages/map";
import { SettingPage } from "@/pages/setting";
import { EditInfoPage } from "@/pages/setting/edit-info/page";
import { AccountManagementPage } from "@/pages/setting/manage-account";
import { SignUpPage } from "@/pages/sign-up";
import PetInfoPage from "@/pages/sign-up/pet-info/page";
import { UserInfoRegistrationPage } from "@/pages/sign-up/user-info";
import { ROUTER_PATH } from "@/shared/constants";
import { MainPage } from "../pages";
import { AppProviderLayout } from "./AppProviderLayout";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.MAIN,
    element: <AppProviderLayout />,
    children: [
      {
        index: true,
        element: <MainPage />, // 탐색
      },
      {
        path: ROUTER_PATH.MAP,
        element: <MapPage />, // 지도
      },
      {
        path: ROUTER_PATH.PROFILE,
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: ROUTER_PATH.FOLLOWINGS,
            element: <FollowingPage />,
          },
          {
            path: ROUTER_PATH.FOLLOWERS,
            element: <FollowerPage />,
          },
        ],
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
          {
            path: ROUTER_PATH.EDIT_MY_INFO,
            element: <EditInfoPage />,
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
